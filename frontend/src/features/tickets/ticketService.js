import axios from 'axios';

const API_URL = '/api/tickets';

//  Helper for auth headers
const authConfig = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

//  Create Ticket
const createTicket = async (ticketData, token) => {
  const response = await axios.post(API_URL, ticketData, authConfig(token));
  return response.data; 
};

//  Get all Tickets
const getTickets = async (token) => {
  const response = await axios.get(API_URL, authConfig(token));
  return response.data;
};

//  Get single Ticket
const getTicket = async (ticketId, token) => {
  const response = await axios.get(`${API_URL}/${ticketId}`, authConfig(token));
  return response.data;
};

//  Close Ticket
const closeTicket = async (ticketId, token) => {
  const response = await axios.put(`${API_URL}/${ticketId}/resolve`, {}, authConfig(token));
  return response.data;
};

const ticketService = {
  createTicket,
  getTickets,
  getTicket,
  closeTicket,
};

export default ticketService;
