# NeuraFind.ai

## Project Summary

This project is a modern web application built using **Next.js** and **React** that focuses on providing an AI-powered product selection experience. The application helps users find products tailored to their needs by offering intelligent recommendations based on user input in thier **natural language**. It integrates with **OpenAI** for generating responses and uses **Pinecone** to manage embeddings and perform vector searches.

### Key Features:
- **AI-Powered Recommendations**: Leverages OpenAI's capabilities to generate personalized product recommendations and provide detailed responses to user queries.
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices, ensuring a seamless experience across all screen sizes.
- **Dynamic Navigation**: Includes navigation links to various sections like Features, Pricing, and Examples to enhance user engagement.
- **Interactive UI Elements**: Incorporates animations (via **Framer Motion**) and interactive components (like buttons and tooltips) for a smooth user experience.
- **Voice Input**: Allows users to interact with the platform via voice commands for more natural engagement.
- **Real-Time Data Handling**: The backend processes user queries and audio transcriptions efficiently for quick, responsive interactions.

## Performance and Optimization
- **Code Splitting**: Thanks to Next.js, the app automatically performs code splitting, ensuring that only the necessary JavaScript is loaded for the current page, improving load times.
- **Static Site Generation (SSG)**: Pages are statically generated for faster loads and better SEO.
- **Efficient State Management**: React's context and hooks are used for optimal state management, ensuring responsiveness and performance.
- **Image Optimization**: Leveraging Next.js's built-in image optimization ensures the best format and size for each image, enhancing performance.

## Dependencies
This project uses a variety of modern libraries and tools to ensure optimal performance, interactivity, and scalability. Below are some of the key dependencies:

- **React**: Frontend framework for building the UI.
- **Next.js**: Server-side rendering, static site generation, and routing.
- **OpenAI API**: Provides AI capabilities for generating responses and product recommendations.
- **Pinecone**: Used for efficient vector storage and retrieval of embeddings.
- **Framer Motion**: Adds animations and transitions to UI components for a dynamic experience.
- **Voice Recognition API**: Facilitates voice input for user interaction.
  
## Performance Metrics
- **Load Times**: With the use of Next.js optimizations like static site generation and code splitting, the expected page load times are under 1 second for optimized pages.
- **Scalability**: The use of **Pinecone** for vector storage and retrieval ensures the application can scale efficiently as the user base grows.

## User Engagement
- **Voice Input & AI Recommendations**: These features significantly improve user engagement, allowing for personalized and efficient product discovery.
- **Interactive UI**: Dynamic animations, tooltips, and responsive design contribute to an engaging and enjoyable user experience.

## Getting Started

### Prerequisites

To run the project locally, make sure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **Yarn** (depending on your package manager of choice)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/adysingh5711/neurafind.ai_Frontend
    ```

2. Navigate into the project directory:

    ```bash
    cd neurafind.ai_Frontend
    ```

3. Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

4. Set up environment variables for OpenAI and Pinecone:
    - Rename the `.env.example` file to `.env` and add your keys:

5. Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. Open the application in your browser at `http://localhost:3000`.

## Usage

- **Search for Products**: Enter keywords into the search bar to receive product recommendations.
- **Voice Input**: Use the voice input feature to make queries or requests by speaking.
- **Navigation**: Use the dynamic navigation bar to explore other sections like Features, Pricing, and Examples.

## Future Improvements

- **Advanced Personalization**: Enhance the AI recommendation system to provide more accurate and personalized suggestions.
- **User Profiles**: Allow users to create profiles to save their preferences and recommendations.
- **Multi-Language Support**: Extend the application to support multiple languages for a broader user base.
- **Product Comparison**: Add a feature to compare products side by side, helping users make more informed decisions.
- **Extension** : Add an extension for chrome and firefox to help users find products on any website.

## License

Backend Repository: [NeuraFind.ai_Backend](https://github.com/RajGM/product-voice)

## License

This project is licensed under the MIT License.

## Acknowledgements

- **OpenAI** for their API and advanced AI capabilities.
- **Pinecone** for their vector database service that powers efficient product searches.
- **Framer Motion** for providing easy-to-implement animations and transitions.
