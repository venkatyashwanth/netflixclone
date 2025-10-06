"use client";

import { useAuth } from "@/contexts/Authcontext";

export default function Testdb() {
    const {testdb} =  useAuth();
    const handleData = () => {
        testdb("xKnO5E9KB83aNu3R6a8C");
    }
    return (
        <div>
            <button onClick={() => handleData()}>Click</button>
        </div>
    )
}