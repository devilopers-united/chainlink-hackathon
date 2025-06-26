import { useState } from "react";

const HelloWorld = ({ greet }: { greet?: string }) => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1)
    }

    return (
        <div style={{
            flex: 1,
            flexDirection: "row"
        }}>
            <div style={{
                padding: 4,
                backgroundColor: "red",
                color: "white",
            }}>{greet || "Hello world"}</div>

            <button onClick={handleClick}>Increase Count</button>
            <div>{count}</div>
        </div>
    )
}

export default HelloWorld