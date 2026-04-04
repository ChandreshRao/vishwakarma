# Coding Conventions

## Overview
This document enforces rules for extending the codebase smoothly, aiming to enforce high standards, unhindered readability, and consistency across Python scripts and React.

## Formatting & Linting
- **ESLint**: Standard JS linting is embedded. Follow modern ES rules. React hooks rule (`eslint-plugin-react-hooks`) must be adhered to strictly.
- **Python Conventions**: Use semantic variables and maintain clear indentation loops. Scripts operate primarily without class abstractions for straight-line procedural execution.

## React Specifics
- **Component Declaration**: Utilize functional components consistently.
- **Styling Methodologies**: Do not implement auxiliary css files per component. Adhere stringently to `TailwindCSS` inline utilities combined creatively through `clsx/tailwind-merge`.
- **Props Definition**: Until TypeScript is introduced, enforce logical destructuring of props.
- **Hooks Limitations**: Global fetch state and context mutations should reside in abstract `/context/` spaces—components should only consume parameters.

## Markdown & Content Syntax
- **Frontmatter Requirement**: Any `.md` or `.txt` content managed in GDrive necessitates YML frontmatter to specify standard properties: `slug`, `title`, and descriptive mappings.
- **File Excerpts**: For missing descriptions, python scripts derive 200-character fallbacks automatically. Provide excerpts willingly inside standard frontmatter for absolute control.
