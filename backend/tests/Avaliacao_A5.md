# A5 Evaluation Test Documentation

This document explains which automated tests fulfill the A5 evaluation criteria and how they map to project units. It also includes a verbatim verbose test run as evidence.

## Criteria Covered

We implemented tests using the following criteria:

- Equivalence Class Partitioning (ECP)
- Boundary Value Analysis (BVA)
- Pairwise Testing

## Units Covered (≥ 3)

- Validation utilities (`validatePasswordStrength`, `validateEmailFormat`)
- Authentication endpoint (`POST /auth/login`)
- Badges service (`checkAndAwardBadges` using `activities` data)
- Groups endpoints (additional functional coverage)

## Test Files and Criteria Mapping

### 1) Validation Utils (ECP + BVA)
- File: `backend/tests/unit/password.validation.test.ts`
- Unit: `src/utils/validations.utils.ts`
- Criteria:
  - ECP: Invalid password classes (missing uppercase, missing lowercase, missing digit, missing special char); invalid email formats.
  - BVA: Password length threshold (7 fails, 8 passes); Email TLD length (1 fails, 2 passes).
- Notes: Each failure mode checks explicit error messages; positive cases assert null/empty errors.

### 2) Login Endpoint (Pairwise)
- File: `backend/tests/auth/login.pairwise.test.ts`
- Unit: `POST /auth/login` (controller `src/controllers/auth.controller.ts`)
- Criteria:
  - Pairwise: Minimal set covering all pairs of parameters:
    - `identifierType`: email | cpf
    - `formatValidity`: valid | invalid
    - `existence`: exists | absent (known vs unknown user)
    - `passwordCorrect`: yes | no
- Generation approach:
  - A small helper builds the full Cartesian product and greedily selects only combinations that introduce new unseen pairs, ensuring every pair across parameters appears at least once.
- Assertions:
  - Success when format valid + user exists + password correct → `200` with token.
  - Otherwise → `400` or `401` depending on validation vs credential mismatch.

### 3) Badges Service (ECP + BVA)
- File: `backend/tests/badges/badge.award.boundary.test.ts`
- Unit: `src/services/badge.service.ts` (function `checkAndAwardBadges`), DB tables `activities`, `user_badges`, `badges`.
- Criteria:
  - ECP: Actions count below/at/above threshold; streak below/at threshold.
  - BVA: Explicit checks at 9/10/11 actions and 6/7 streak.
- Setup:
  - Inserts a test user, seeds minimal badges (milestone = 10 actions, streak = 7 days), and inserts actions with `imagem_path` to satisfy schema.
- Assertions:
  - Before threshold → badge not awarded.
  - At threshold → awarded.
  - Above threshold → remains awarded.

### 4) Groups Endpoints (Functional)

#### 4.1) `groups.test.ts` — End-to-end flows
- Endpoints covered: `POST /groups`, `POST /groups/join`, `GET /groups/my-groups`.
- Scenarios:
  - Create Group:
    - 401 when missing token.
    - 400 when name is empty.
    - 201 success with `id`, `owner_id`, `invite_code` (owner auto-member verified via DB).
  - Join Group:
    - 401 when missing token.
    - 400 for invalid invite code.
    - 400 when the owner tries to join (already a member).
    - 200 for a different user joining successfully (membership echoed in response).
  - List My Groups:
    - 401 without token; 200 with token; list contains the created group for owner and joined user.

#### 4.2) `group_validation.test.ts` — Input validation via Equivalence Partitioning
- Criterion: ECP of "Group Name":
  - Invalid partition: empty string.
  - Valid partition: non-empty string.
- Expectations:
  - 400 for empty name.
  - 201 for valid name (response includes `invite_code`).
- Notes: obtains a valid auth token up-front; cleans up created data.

#### 4.3) `group_join_logic.test.ts` — Decision Table (Cause–Effect Graph)
- Causes (inputs): Token present, Invite code validity, Already a member.
- Effects (outputs): HTTP status (`401`, `400`, `200`).
- Decision table cases executed:
  - Case 1: No token → 401 Unauthorized.
  - Case 2: Token + invalid invite → 400 Bad Request.
  - Case 3: Token + valid invite + already member (owner) → 400 Bad Request.
  - Case 4: Token + valid invite + not member (new user) → 200 OK.
- Setup: owner and new user registered; owner creates a group (produce `invite_code`).

## How to Run (Windows)

```bat
cd backend
npm test -- --verbose
```

## Results (Latest Verbose Output)

```

> carbon-fighters-backend@1.0.0 test
> cross-env NODE_ENV=test jest --detectOpenHandles --forceExit --verbose

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

  console.error
    Error: Invalid invite code or group not found.
        at GroupService.<anonymous> (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:101:19)
        at Generator.next (<anonymous>)
        at fulfilled (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:38:58)

      47 |
      48 |         } catch (error) {
    > 49 |             console.error(error);
         |                     ^
      50 |             const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
      51 |             
      52 |             // Handle specific errors from the service with appropriate status codes

      at src/controllers/group.controller.ts:49:21
          at Generator.throw (<anonymous>)
      at rejected (src/controllers/group.controller.ts:6:65)

  console.error
    Error: You are already a member of this group.
        at GroupService.<anonymous> (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:111:19)
        at Generator.next (<anonymous>)
        at fulfilled (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:38:58)

      47 |
      48 |         } catch (error) {
    > 49 |             console.error(error);
         |                     ^
      50 |             const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
      51 |             
      52 |             // Handle specific errors from the service with appropriate status codes

      at src/controllers/group.controller.ts:49:21
          at Generator.throw (<anonymous>)
      at rejected (src/controllers/group.controller.ts:6:65)

 PASS  tests/groups/group_join_logic.test.ts
  Groups: Join Logic (Decision Table)
    √ Case 1: Invalid Token -> 401 Unauthorized (10 ms)
    √ Case 2: Valid Token + Invalid Invite -> 400 Bad Request (24 ms)
    √ Case 3: Valid Token + Valid Invite + Already Member -> 400 Bad Request (12 ms)
    √ Case 4: Valid Token + Valid Invite + Not Member -> 200 OK (13 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

 PASS  tests/auth/register.test.ts
  Register Endpoint
    √ Should register a new user successfully (26 ms)
    √ Should not register a repeated CPF (8 ms)
    √ Should not register a repeated email (12 ms)
    √ Should fail for weak password: St@1 (10 ms)
    √ Should fail for weak password: strongpwd@1 (11 ms)
    √ Should fail for weak password: STRONGPWD@1 (13 ms)
    √ Should fail for weak password: Strongpwd@ (13 ms)
    √ Should fail for weak password: Strongpwd1 (8 ms)
    √ Should fail for invalid email format: plainaddress (7 ms)
    √ Should fail for invalid email format: @missingusername.com (8 ms)
    √ Should fail for invalid email format: username@.com (7 ms)
    √ Should fail for invalid email format: username@com (7 ms)
    √ Should fail for invalid email format: username@domain..com (7 ms)
    √ Should fail for invalid email format: username@domain,com (7 ms)
    √ Should fail for invalid email format: username@domain@domain.com (6 ms)
    √ Should fail for invalid email format: username@.domain.com (7 ms)
    √ Should fail for invalid email format: username@domain..com (7 ms)
    √ Should succeed for valid (even weird) email format: simple@example.com (16 ms)
    √ Should succeed for valid (even weird) email format: user.name@example.com (17 ms)
    √ Should succeed for valid (even weird) email format: user-name@example.com (17 ms)
    √ Should succeed for valid (even weird) email format: user+mailbox/department=shipping@example.com (17 ms)
    √ Should succeed for valid (even weird) email format: !#$%&'*+-/=?^_`{}|~@example.org (17 ms)
    √ Should succeed for valid (even weird) email format: much.more.unusual@dept.example.com (16 ms)
    √ Should succeed for valid (even weird) email format: user%example.com@example.org (17 ms)
    √ Should succeed for valid (even weird) email format: user.name+tag+sorting@example.com (18 ms)
    √ Should succeed for valid (even weird) email format: x@example.com (16 ms)
    √ Should succeed for valid (even weird) email format: example-indeed@strange-example.com (16 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

  console.error
    Error: Group name is required.
        at GroupService.validateGroupCreation (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:19:19)
        at GroupService.<anonymous> (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:47:14)
        at Generator.next (<anonymous>)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:41:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:37:12)
        at GroupService.createGroup (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:83:16)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:16:49
        at Generator.next (<anonymous>)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:8:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:4:12)
        at createGroup (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:16:16)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\route.js:149:13)
        at authMiddleware (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\middleware\auth.middleware.ts:28:9)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\route.js:149:13)
        at Route.dispatch (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\route.js:119:3)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:284:15
        at Function.process_params (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:346:12)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:280:10)
        at Function.handle (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:175:3)
        at router (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:47:12)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at trim_prefix (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:328:13)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:286:9
        at Function.process_params (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:346:12)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:280:10)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\body-parser\lib\read.js:137:5
        at AsyncResource.runInAsyncScope (node:async_hooks:214:14)
        at invokeCallback (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\raw-body\index.js:238:16)
        at done (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\raw-body\index.js:227:7)
        at IncomingMessage.onEnd (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\raw-body\index.js:287:7)
        at IncomingMessage.emit (node:events:519:28)
        at endReadableNT (node:internal/streams/readable:1698:12)
        at processTicksAndRejections (node:internal/process/task_queues:90:21)

      20 |
      21 |         } catch (error) {
    > 22 |             console.error(error);
         |                     ^
      23 |             const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
      24 |             
      25 |             // Handle validation errors (from service) with appropriate status codes

      at src/controllers/group.controller.ts:22:21
          at Generator.throw (<anonymous>)
      at rejected (src/controllers/group.controller.ts:6:65)

  console.error
    Error: Invalid invite code or group not found.
        at GroupService.<anonymous> (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:101:19)
        at Generator.next (<anonymous>)
        at fulfilled (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:38:58)

      47 |
      48 |         } catch (error) {
    > 49 |             console.error(error);
         |                     ^
      50 |             const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
      51 |             
      52 |             // Handle specific errors from the service with appropriate status codes

      at src/controllers/group.controller.ts:49:21
          at Generator.throw (<anonymous>)
      at rejected (src/controllers/group.controller.ts:6:65)

  console.error
    Error: You are already a member of this group.
        at GroupService.<anonymous> (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:111:19)
        at Generator.next (<anonymous>)
        at fulfilled (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:38:58)

      47 |
      48 |         } catch (error) {
    > 49 |             console.error(error);
         |                     ^
      50 |             const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
      51 |             
      52 |             // Handle specific errors from the service with appropriate status codes

      at src/controllers/group.controller.ts:49:21
          at Generator.throw (<anonymous>)
      at rejected (src/controllers/group.controller.ts:6:65)

 PASS  tests/groups/groups.test.ts
  Groups Endpoints
    POST /groups
      √ should fail to create a group without an auth token (9 ms)
      √ should fail to create a group if name is missing (15 ms)
      √ should create a new group successfully for an authenticated user (9 ms)
    POST /groups/join
      √ should fail to join a group without an auth token (8 ms)
      √ should fail to join a group with an invalid invite code (9 ms)
      √ should fail if the user is already a member (e.g., the owner) (9 ms)
      √ should allow a new user (Bob) to join the group successfully (10 ms)
    GET /groups/my-groups
      √ should fail to get groups without an auth token (8 ms)
      √ should show Alice's group for Alice (8 ms)
      √ should show Alice's group for Bob (who joined) (8 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

 PASS  tests/auth/login.pairwise.test.ts
  Login Pairwise Interaction Coverage
    √ Scenario 0 {
  identifierType: 'email',
  formatValidity: 'valid',
  existence: 'exists',
  passwordCorrect: 'yes'
} (15 ms)
    √ Scenario 1 {
  identifierType: 'email',
  formatValidity: 'valid',
  existence: 'exists',
  passwordCorrect: 'no'
} (16 ms)
    √ Scenario 2 {
  identifierType: 'email',
  formatValidity: 'valid',
  existence: 'absent',
  passwordCorrect: 'yes'
} (8 ms)
    √ Scenario 3 {
  identifierType: 'email',
  formatValidity: 'valid',
  existence: 'absent',
  passwordCorrect: 'no'
} (7 ms)
    √ Scenario 4 {
  identifierType: 'email',
  formatValidity: 'invalid',
  existence: 'exists',
  passwordCorrect: 'yes'
} (7 ms)
    √ Scenario 5 {
  identifierType: 'email',
  formatValidity: 'invalid',
  existence: 'exists',
  passwordCorrect: 'no'
} (7 ms)
    √ Scenario 6 {
  identifierType: 'email',
  formatValidity: 'invalid',
  existence: 'absent',
  passwordCorrect: 'yes'
} (7 ms)
    √ Scenario 7 {
  identifierType: 'cpf',
  formatValidity: 'valid',
  existence: 'exists',
  passwordCorrect: 'yes'
} (15 ms)
    √ Scenario 8 {
  identifierType: 'cpf',
  formatValidity: 'valid',
  existence: 'exists',
  passwordCorrect: 'no'
} (14 ms)
    √ Scenario 9 {
  identifierType: 'cpf',
  formatValidity: 'valid',
  existence: 'absent',
  passwordCorrect: 'yes'
} (6 ms)
    √ Scenario 10 {
  identifierType: 'cpf',
  formatValidity: 'invalid',
  existence: 'exists',
  passwordCorrect: 'yes'
} (7 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

  console.error
    Error: Group name is required.
        at GroupService.validateGroupCreation (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:19:19)
        at GroupService.<anonymous> (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:47:14)
        at Generator.next (<anonymous>)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:41:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:37:12)
        at GroupService.createGroup (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\services\group.service.ts:83:16)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:16:49
        at Generator.next (<anonymous>)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:8:71
        at new Promise (<anonymous>)
        at __awaiter (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:4:12)
        at createGroup (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\controllers\group.controller.ts:16:16)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\route.js:149:13)
        at authMiddleware (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\src\middleware\auth.middleware.ts:28:9)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\route.js:149:13)
        at Route.dispatch (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\route.js:119:3)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:284:15
        at Function.process_params (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:346:12)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:280:10)
        at Function.handle (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:175:3)
        at router (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:47:12)
        at Layer.handle [as handle_request] (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\layer.js:95:5)
        at trim_prefix (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:328:13)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:286:9
        at Function.process_params (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:346:12)
        at next (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\express\lib\router\index.js:280:10)
        at C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\body-parser\lib\read.js:137:5
        at AsyncResource.runInAsyncScope (node:async_hooks:214:14)
        at invokeCallback (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\raw-body\index.js:238:16)
        at done (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\raw-body\index.js:227:7)
        at IncomingMessage.onEnd (C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\node_modules\raw-body\index.js:287:7)
        at IncomingMessage.emit (node:events:519:28)
        at endReadableNT (node:internal/streams/readable:1698:12)
        at processTicksAndRejections (node:internal/process/task_queues:90:21)

      20 |
      21 |         } catch (error) {
    > 22 |             console.error(error);
         |                     ^
      23 |             const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
      24 |             
      25 |             // Handle validation errors (from service) with appropriate status codes

      at src/controllers/group.controller.ts:22:21
          at Generator.throw (<anonymous>)
      at rejected (src/controllers/group.controller.ts:6:65)

 PASS  tests/groups/group_validation.test.ts
  Groups: Input Validation (EP)
    √ should REJECT creation when name is empty (Invalid Partition) (14 ms)
    √ should ACCEPT creation when name is valid (Valid Partition) (10 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

 PASS  tests/auth/login.test.ts
  Login Endpoint
    √ should log in an existing user and return a token (15 ms)
    √ should fail to log in with incorrect credentials (16 ms)
    √ should fail to log in with incorrect credentials (7 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

 PASS  tests/auth/password_validation.test.ts
  Auth: Password Validation (BVA)
    √ should REJECT a password with 7 characters (Boundary - 1) (10 ms)
    √ should ACCEPT a password with 8 characters (Boundary) (18 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

 PASS  tests/factories/badge.factory.test.ts
  BadgeFactory
    createBadge - Factory Method
      STREAK Badges
        √ should create a 7-day streak badge (1 ms)
        √ should create a 30-day streak badge
        √ should create a 100-day streak badge
        √ should create a custom streak badge for non-standard days (1 ms)
      MILESTONE Badges
        √ should create a 10 actions milestone badge (1 ms)
        √ should create a 100 actions milestone badge (Eco Rookie) (1 ms)
        √ should create a 500 actions milestone badge (Eco Warrior)
        √ should create a 1000 actions milestone badge (Eco Legend)
        √ should create a custom milestone badge for non-standard counts
      SPECIAL Event Badges
        √ should create Earth Day 2025 special badge (1 ms)
        √ should create Zero Waste Challenge special badge
        √ should create Environment Week special badge
        √ should create a generic special badge for unknown event IDs (1 ms)
      CATEGORY Badges
        √ should create Green Transport Master badge (1 ms)
        √ should create Recycling King badge (1 ms)
        √ should create Water Guardian badge (1 ms)
        √ should create Energy Warrior badge
        √ should create a generic category badge for unknown categories (1 ms)
      Error Handling
        √ should throw error for unknown badge type (9 ms)
        √ should throw error for negative requirement
        √ should accept zero as requirement
      Badge Properties Validation
        √ should create badges with all required fields (3 ms)
        √ should not include DB-generated fields (id, created_at) in created badges (1 ms)
    Helper Methods
      getAvailableBadgeTypes
        √ should return all badge types (1 ms)
      getExampleBadges
        √ should return array of example badges (1 ms)
        √ should include at least one badge of each type
        √ should return valid badge objects (3 ms)
    Points Calculation Logic
      √ should calculate streak badge points as days * 10
      √ should set milestone badge points equal to action count
      √ should set category badge points to 300

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

 PASS  tests/badges/badge.award.boundary.test.ts
  Badge Awarding - Partitions & Boundaries
    √ No badges when below action threshold (9 actions) (5 ms)
    √ Award milestone badge at boundary (10 actions) (2 ms)
    √ Badge persists above boundary (11 actions) (2 ms)
    √ Award streak badge at boundary (current_streak = 7) (4 ms)

  console.log
    📊 Database schema initialized from SQL file: C:\Users\Bruno\Documents\MC626\CarbonFighters\backend\data\create_tables.sql

      at src/services/db.service.ts:84:13

  console.log
    ✅ Added current_streak column to users table

      at src/services/db.service.ts:100:21

  console.log
    ✅ Added last_action_date column to users table

      at src/services/db.service.ts:105:21

  console.log
    ✅ Connected to in-memory test database

      at src/services/db.service.ts:44:25

  console.log
    ✅ Test database initialized

      at tests/setup.ts:17:17

 PASS  tests/unit/password.validation.test.ts
  Password Validation - Equivalence Partitions & Boundary Values
    √ Valid password passes (boundary length 8) (1 ms)
    √ Length 7 fails
    √ Missing uppercase (1 ms)
    √ Missing lowercase (1 ms)
    √ Missing digit (1 ms)
    √ Missing special char
    √ Multiple issues accumulate
  Email Validation - Equivalence & Boundary
    √ Valid email passes
    √ Missing @ fails (1 ms)
    √ Missing dot in domain fails (1 ms)
    √ Boundary TLD length 1 fails (1 ms)
    √ Boundary TLD length 2 passes

Test Suites: 10 passed, 10 total
Tests:       105 passed, 105 total
Snapshots:   0 total
Time:        3.569 s
Ran all test suites.
PS C:\Users\Bruno\Documents\MC626\CarbonFighters\backend>
```
