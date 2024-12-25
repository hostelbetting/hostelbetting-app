import { useEffect, useState } from "react"
import axios from "../configs/axios-configs"

export const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                await axios.get("/user/current-user")
                    .then(res => {
                        setCurrentUser(res?.data?.data);
                    })
            } catch (error) {
                console.error(error);

            }
        }
        fetchUser();
    }, []);

    return currentUser;
}