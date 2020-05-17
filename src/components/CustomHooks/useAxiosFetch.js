import {useState, useEffect} from "react";
import axios from "axios";

const useAxiosFetch = (url, timeout) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unmounted = false;
        let source = axios.CancelToken.source();
        axios.get(url, {
            cancelToken: source.token,
            timeout: timeout
        })
            .then(a => {
                if (!unmounted) {
                    // @ts-ignore
                    setData(a.data);
                    setLoading(false);
                }
            }).catch(function (e) {
            if (!unmounted) {
                setError(true);
                setErrorMessage(e.message);
                setLoading(false);
                if (axios.isCancel(e)) {
                    console.log(`request cancelled:${e.message}`);
                } else {
                    console.log("another error happened:" + e.message);
                }
            }
        });
        return function () {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, [url, timeout]);

    return {data, loading, error, errorMessage};
};

export default useAxiosFetch;