// Declare CSS modules
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

// Declare regular CSS/SCSS files
declare module '*.css';
declare module '*.scss';

// Declare SVGs as React components
declare module '*.svg' {
    const content: string;
    export default content;
}

// Declare image files
declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}