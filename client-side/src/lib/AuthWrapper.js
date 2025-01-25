/**
 * @fileoverview This component ensures that the authentication check is performed before rendering any child components.
 */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../redux/slices/authSlice";
import Spinner from "../components/Spinner/Spinner"

export function AuthWrapper({ children }) {
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Function to check user session
        async function checkSession() {
            if (!authChecked.current) {
                await dispatch(checkAuth());
                setAuthChecked(true);
            }
          
        }
        checkSession();
    }, []);

    // Show Spinner while authentication check is in progress.
    if (!authChecked) {
        return <Spinner />
    }

    // Render children components if authentication is checked
    return children;
}
