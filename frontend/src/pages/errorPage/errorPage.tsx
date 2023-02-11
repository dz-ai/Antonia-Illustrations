import { useRouteError } from "react-router-dom";

interface IError {
    status:number;
    statusText:string;
    message: string;
}

export function ErrorPage() {
    const error = useRouteError() as IError | null;
    console.log(error);

    return (
        <div className="error-page">
            <h2>UNEXPECTED ERROR</h2>

            {
                error &&
                <div className="error-page-content">
                    <p>{error.status}</p>
                    <p>{error.statusText || error.message}</p>
                    &#129327;
                </div>
            }

        </div>
    );
}
