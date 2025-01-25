/**
 * Contains the functions for handling -
 *           authentication, session check, user registration, verification, and logout.
 */
import axios from "axios";
const server_base_url = process.env.REACT_APP_SERVER_BASE_URL;

/**
 * Handles the login request.
 */
async function handleLogin({ password, email }) {
    try {
        //Input validation.
        if (email === "" || password === "") {
            throw new Error("Both email and password are required");
        }

        //API request
        const response = await axios.post(`${server_base_url}/login`, {
            email,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Include cookies in the request
        });

        //return response data if successful.
        if (response.data.success) {
            return {
                success: true,
                data: response.data.data,
                message: "Login successful!"
            }
        }
        else {
            throw new Error(response.data.message || "Login failed. Please try again.");
        }
    } catch (error) {
        //Error handling
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred",
        };
    }
}

/**
 * Handles the registration request.
 */
async function handleRegister({ username, cfID, email, password }) {
    try {
        //API request.
        const response = await axios.post(`${server_base_url}/register`, {
            username,
            email,
            cfID,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        //return response data if successful.
        if (response.data.success) {
            return {
                success: true,
                message: response.data.message
            }
        }
        else {
            throw new Error(response.data.message || "Registration failed. Please try again.");
        }

    } catch (error) {
        //Error handling.
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred",
        }
    }

}

/**
 * Handles the email verification request.
 */
async function handleVerifyEmail({ email, verificationCode }) {
    const token = { email, code: verificationCode };
    try {
        //API request.
        const response = await axios.post(`${server_base_url}/verifyEmail`, token, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        //return response data if successful.
        if (response.data.success) {
            return { success: true, message: response.data.message }
        }
        else {
            throw new Error(response.data.message || "Email verification failed. Please try again.");
        }
    } catch (error) {
        //Error handling.
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred",
        };
    }
}

/**
 * Handles the request for Codeforces verification.
 */
async function handleRequestCfVerification({ cfID, problemID }) {
    const requestTime = new Date();

    try {
        //API request.
        const response = await axios.post(`${server_base_url}/requestCfVerification`, {
            cfID,
            problemID,
            requestTime
        })

        //return response data if successful.
        if (response.data.success) {
            return { success: true, message: response.data.message }
        }
        else {
            throw new Error(response.data.message || "Request failed. Please try again.");
        }
    } catch (error) {
        //Error handling.
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred",
        };
    }
}

/**
 * Handles the verification of Codeforces ID.
 */
async function handleVerifyCfID({ cfID, problemID }) {
    try {
        //API request.
        const response = await axios.post(`${server_base_url}/verifyCfID`, {
            cfID,
            problemID
        })

        //return response data if successful.
        if (response.data.success) {
            return { success: true, message: response.data.message }
        }
        else {
            throw new Error(response.data.message || "Verification failed. Please try again.");
        }

    } catch (error) {
        //Error handling.
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred",
        }
    }
}

/**
 * Checks the session of the client.
 */
const checkSession = async () => {
    try {
        //API request.
        const response = await axios.get(`${server_base_url}/check/session`, {
            withCredentials: true
        })
      
        //return response data if successful.
        if (response.data.success) {
            return { success: true, data: response.data.data }
        }
        else {
            return { success: false, message: response.data.message }
        }

    } catch (error) {
        //Error handling.
        return {
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred",
        };
    }
}

/**
 * Handles the logout request.
 */
const handleLogout= async() => {
    try {
        //API request.
        const response= await axios.post(`${server_base_url}/logout`, {}, {
             withCredentials: true,
        });

        //return response data if successful.
        if(response.data.success){
            return{
                success: true,
                message: "Logout successful !"
            };
        }
        else{
            throw new Error(response.data.message || "Logout failed");
        }

    } catch (error) {
         //Error handling.
         return{
            success: false,
            message: error.response?.data?.message || error.message || "An unknown error occurred"
         };
    }
}

//Exporting the functions.
const authAPI = {
    handleLogin,
    handleRegister,
    handleRequestCfVerification,
    handleVerifyCfID,
    handleVerifyEmail,
    checkSession,
    handleLogout,
}

export default authAPI;