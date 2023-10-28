import { useState, useEffect } from "react";

const useForm = (
    callback: () => void,
    validate: any,
    formObj: { [key: string]: string }
) => {
    const [values, setValues]: any = useState(formObj);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: any, parent: any) => {
        const { name, value, checked, type, files } = event.target;
        setValues({
            ...values,
            ...(parent ? {
                [parent]: {
                    ...values[parent],
                    [name]: !new Set(["checkbox", "file"]).has(type)
                        ? Array.isArray(value) ? value : (typeof value === 'object' &&
                            !Array.isArray(value) ? value : value)
                        : type == "checkbox"
                            ? checked
                            : files[0],

                }
            } : {
                [name]: !new Set(["checkbox", "file"]).has(type)
                    ? Array.isArray(value) ? value : (typeof value === 'object' &&
                        !Array.isArray(value) ? value : value)
                    : type == "checkbox"
                        ? checked
                        : files[0],
            }),
        });
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        console.log(validate(values));
        setErrors(validate(values));
        setIsSubmitting(true);
    };

    useEffect(() => {
        if (errors && Object.keys(errors).length === 0 && isSubmitting) {
            callback();
        }
    }, [errors]);

    useEffect(() => {
        setValues(formObj);
    }, [formObj]);

    return {
        handleChange,
        handleSubmit,
        values,
        errors,
        setErrors,
        setValues,
        setIsSubmitting,
    };
};

export default useForm;
