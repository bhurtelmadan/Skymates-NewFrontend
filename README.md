# Skymates

Skymates is a web application designed to connect Nepali elderly travelers with compassionate companions for long flights. Our focus is on serving the Nepali expat community in the USA, ensuring that no elder travels alone.

## Mission

Our mission is to bring the Nepali community closer by providing a platform where elderly travelers can find caring companions who share their language and culture. We aim to make long-distance journeys comfortable and enjoyable for our beloved elders.

## Key Features

- Connect elderly Nepali travelers with verified companions
- Allow users to sign up as companions and earn $100 per trip
- Display two lists: those looking for companions and those willing to be companions
- Date range filtering for easier trip matching
- User authentication and profile management

## Tech Stack

- Frontend: React
- Styling: Tailwind CSS
- Icons: Lucide React
- Authentication: Clerk
- Backend: Node.js with Express (API URL: https://server-chi-blush.vercel.app/api)
- Database: Not specified in the current code, but likely PostgreSQL or a similar relational database

## Key Components

- User authentication and management (using Clerk)
- Add Passenger form for users to input their travel details
- Passenger lists displaying available companions and those seeking companions
- Date range filtering for trip searches
- Contact functionality to connect users
- Responsive design for mobile and desktop use

## Data Structure

Passenger: 
{ 
  id: number, 
  name: string, 
  age: number, 
  type: string ('needFriend' or 'beFriend'), 
  date: string (YYYY-MM-DD), 
  fromCity: string, 
  toCity: string, 
  phone: string,
  email: string,
  airlines: string,
  comments: string
}

## API Endpoints

- GET /api/passengers: Retrieve all passengers
- POST /api/passengers: Add a new passenger

## Functionality

- Users can sign up to be companions or request companions for their flights
- The app displays two lists: those looking for companions and those willing to be companions
- Users can filter passengers by date range
- Authenticated users can add their flight details and preferences
- Users can view other passengers' details to find potential travel companions
- Contact functionality to connect users (currently redirects to Skymates contact information)

## Safety and Trust

- User verification process (details to be implemented)
- Profile reviews and post-trip feedback system

## Future Enhancements

- Implement direct messaging between users
- Add a rating and review system for companions
- Integrate a payment system for companion compensation
- Expand to serve other communities and regions
