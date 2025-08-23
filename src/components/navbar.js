"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const email = localStorage.getItem("email");
        setIsLoggedIn(!!email);
    }, []);

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" }).catch(() => { });
        localStorage.removeItem("email");
        setIsLoggedIn(false);
        router.push("/");
    }

    return (
        <nav id="desktop-nav">
            <div className="logo"><Link href="/">CurrenTrip</Link></div>
            <div>
                <ul className="nav-links">
                    {isLoggedIn ? (
                        <>
                            <li><Link href="/trips">My Trips</Link> </li>
                            <li><Link href="/add_trip">Add Trip</Link></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link href="/signup">Signup</Link></li>
                            <li><Link href="/login">Login</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}