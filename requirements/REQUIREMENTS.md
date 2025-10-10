# Benchmarking Analysis

## 1. Overview and Selected Applications

For the requirements elicitation of the project, we conducted a market analysis to identify established features, gather innovative ideas, and understand UI/UX best practices in similar applications.

The following applications were selected for analysis:

- [Gymrats](https://www.gymrats.app/) (Fitness app that allows users to create and join training challenges with friends and family)
- [Earth Hero](https://www.earthhero.org/es/) (Global app for measuring carbon footprint and eco-friendly actions)
- [Gira](https://gira.com.ec/) (Ecuadorian waste management project that promotes the circular economy through recycling)
- [AWorld](https://aworld.org/) (The official app for the UN's "Act Now" campaign, using educational content, gamified challenges, and collective goals to promote sustainable habits)

---

## 2. Detailed Application Analysis

### 2.1 AWorld

"Act Now" serves as the official app for the United Nations' campaign, functioning as an educational tool with strong credibility. Its main purpose is to engage a global community in climate action by allowing users to calculate their carbon footprint and participate in gamified challenges to collectively save CO2, water, and energy.

#### Feature and Characteristic Analysis

##### Feature: Questionnaire-Based Carbon Footprint Calculation
The app calculates a user's initial carbon footprint through a guided questionnaire about their lifestyle habits. This feature provides a personalized baseline, giving users a tangible starting point and a metric against which they can measure their progress.

**Visual Evidence:**
![Image description](path/to/your/image.png)

##### Feature: Collective Goal-Oriented Gamification
AWorld employs a gamification system with points, levels, and badges to motivate users. However, its competition mechanics are focused on collective achievement rather than direct rivalry. Users participate in time-based, public "Collective Challenges" where they contribute to a large-scale shared goal, such as a global reduction in CO₂.

**Visual Evidence:**
![Image description](path/to/your/image.png)

##### Feature: Daily Streak Challenge
This feature stimulates the user to open the app daily to maintain their engagement streak. It offers rewards within the gamification system for users who successfully keep their streak active.

**Visual Evidence:**
![Streak Page](../requirements/assets/streak.jpeg)

##### Feature: Community Engagement Tools
The application includes a group and a chronological activity feed to foster a sense of a global community. These tools allow users to see other users profiles and see the sustainable actions others are taking, though they lack features for social proof like photo sharing and chat communication.

**Visual Evidence:**
![Image description](path/to/your/image.png)

*(Continue adding feature sections as needed)*

---

#### Strengths (Pros):
* **Strong Credibility and Authority:** As the official app of the UN's "Act Now" campaign, it has a high level of trust and authority that is difficult for other apps to replicate.
* **Effective Educational Positioning:** The app successfully positions itself as an educational tool, which is a strong draw for users looking to learn more about sustainability.
* **Clear Onboarding with Footprint Calculation:** The initial questionnaire provides a clear and personalized starting point for users, helping them understand their specific impact from the beginning.
* **Fosters a Sense of Global Mission:** The focus on large-scale, collective goals can be highly motivating for users who want to feel part of a worldwide movement for positive change.

#### Weaknesses (Cons):
* **Lack of Direct, Small-Group Competition:** The app's primary weakness, in the context of our project, is its focus on collective achievement rather than direct rivalry between friends. This is the key market gap CarbonFighter aims to fill.
* **No "Social Proof" via Photo Sharing:** The app does not include photo sharing in its activity feed, missing a key engagement and validation mechanism that is highly successful in social fitness apps like GymRats.
* **Limited User Agency in Group Creation:** Group creation is limited to admins, which restricts the user-driven, spontaneous creation of challenges that is central to the GymRats model.
* **Inflexible Group Structure:** The app only offers one type of group ("Collective Challenges"), lacking the flexibility of offering both time-bound competitions and ongoing communities ("Clubs").

---
### 2.2 [Application Name 2]

*(Repeat the same structure from Application 1 for all other selected applications)*

---

## 3. Synthesis and Final Analysis

*This final section is crucial. Here you will consolidate all the learnings from the analysis.*

### 3.1 General Patterns and Observations

*Based on the analysis of all applications, list the most important patterns and observations. What do they have in common? What stands out as a market trend?*

* **Common Patterns:** (e.g., "Most applications divide content into topics and subtopics and use a gamification system to engage users").
* **Innovative Highlights:** (e.g., "The feature to export content as Markdown from 'Notion' is a major differentiator for advanced users").
* **Common Weaknesses:** (e.g., "We noted that keyboard accessibility is a weak point in most applications that use interactive maps").

### 3.2 Elicited Requirements and Features of Interest

*Translate your observations into a list of potential requirements or features for your project. This list will be the foundation for creating your Epics and User Stories.*

* **[Requirement 1]**: (e.g., The system should allow searching by postal code in addition to the city name).
* **[Requirement 2]**: (e.g., The system should save the user's search history locally).
* **[Requirement 3]**: (e.g., The interactive map must be fully navigable using only the keyboard).
* **[Requirement 4]**: (e.g., Implement a newsletter system for user engagement).
* ...