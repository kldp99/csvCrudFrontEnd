
export const formObj = {
    name: "",
    email: "",
    surName: "",
    age: "",
};

export const validate = (values: any) => {
    const errors: any = {};
    Object.keys(formObj).forEach((each) => (!values?.[each]) && (errors[each] = `${each} is required`));
    return errors;
};
