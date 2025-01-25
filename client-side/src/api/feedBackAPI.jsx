import axios from 'axios';

const server_base_url = process.env.REACT_APP_SERVER_BASE_URL;

/**
 *  Handles feedback submission request.
 */
const submitFeedback = async (feedbackData) => {
    try {
        //API request.
        const response = await axios.post(`${server_base_url}/feedBack`, feedbackData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        //return response data if successful.
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message
            }
        }
        else {
            throw new Error(response.data.message || "Submission failed. Please try again.");
        }
    } catch (error) {
        //Error handling.
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred",
        };
    }
};

const feedbackAPI = { submitFeedback };

export default feedbackAPI;
