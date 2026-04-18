import Auth from "./Auth.js";
import Loader from "../components/Loader/Loader.jsx";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

type EnhancedCompProps = {
    validRole: string | string[]
}

type State = true | false | undefined;

export default function withAuth(Component: React.FC) {
    return function EnhancedComponent(props: EnhancedCompProps) {
        const navigate = useNavigate()
        const [auth, setAuth] = useState<State>(undefined);
        const { validRole, ...rest } = props;
        useEffect(() => {
            async function checkAuthentication() {
                const roles = Array.isArray(validRole) ? validRole : [validRole];
                if (await Auth.isAuthenticated() && Auth.isAuthorize(...roles)) {
                    setAuth(true);
                }
                else {
                    setAuth(false)
                }
            }
            checkAuthentication();
        }, [])

        useEffect(() => {
            if (auth === false) {
                navigate("/login");
            }
        }, [auth, navigate]);

        if (auth === undefined) return <Loader />;
        if (auth === false) return null;

        return <Component {...rest} />;


    }
}