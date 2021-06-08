import { useState, useEffect } from "react";
import * as yup from "yup";
import { number, string } from "yup/lib/locale";
import axios from "axios";
import {
    StyledInput,
    StyledSpan,
    StyledCheckbox,
    StyledWrapper,
    StyledButton,
} from "../styles/formStyles";

// set up form validation
const formSchema = yup.object().shape({
    name: yup.string().required("please enter a name"),
    email: yup.string().email().required("please enter a valid email address"),
    birthday: yup.lazy((value) => {
        if (value === "") {
            return yup.string();
        }
        return yup.number().max(6012021).typeError("are you from the future??");
    }),
    emailConsent: yup.bool().oneOf([true], "please check the box"),
});

const Form = () => {
    const [user, setUser] = useState();
    const [formState, setFormState] = useState({
        id: Date.now(),
        name: "",
        email: "",
        birthday: "",
        emailConsent: false,
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        birthday: "",
        emailConsent: "",
    });
    // button enabling and validation
    const [buttonDisabled, setButtonDisabled] = useState(true);
    useEffect(() => {
        formSchema.isValid(formState).then((valid) => {
            setButtonDisabled(!valid);
        });
    }, [formState]);

    const validateChange = (event) => {
        yup.reach(formSchema, event.target.name)
            .validate(event.target.value)
            .then((valid) => {
                setErrors({
                    ...errors,
                    [event.target.name]: "",
                });
            })
            .catch((err) => {
                setErrors({
                    ...errors,
                    [event.target.name]: err.errors[0],
                });
            });
    };
    // input changes
    const handleChange = (event) => {
        event.persist();
        const newFormData = {
            ...formState,
            [event.target.name]:
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value,
        };
        validateChange(event);
        setFormState(newFormData);
    };
    // form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post(
                "https://my-json-server.typicode.com/JustUtahCoders/interview-users-api/users",
                formState
            )
            .then((response) => {
                setUser(response.data);
                alert("Thank you for contacting us!");
                setFormState({
                    name: "",
                    email: "",
                    birthday: "",
                    emailConsent: false,
                });
            })
            .catch((error) => {
                console.log(error.response);
            });
    };
    const handleClearForm = (event) => {
        event.preventDefault();
        setFormState({
            name: "",
            email: "",
            birthday: "",
            emailConsent: false,
        });
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">
                    <StyledInput
                        type="text"
                        placeholder="name*"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                    />
                    {errors.name.length > 0 ? (
                        <p className="error">{errors.name}</p>
                    ) : null}
                </label>

                <label htmlFor="email">
                    <StyledInput
                        type="email"
                        placeholder="email*"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                    />
                    {errors.email.length > 0 ? (
                        <p className="error">{errors.email}</p>
                    ) : null}
                </label>

                <label htmlFor="birthday">
                    <StyledInput
                        type="text"
                        placeholder="birthdate (example: 11051955)"
                        name="birthday"
                        value={formState.birthday}
                        onChange={handleChange}
                    />
                </label>
                <StyledWrapper>
                    <label className="emailConsent">
                        <StyledCheckbox
                            type="checkbox"
                            name="emailConsent"
                            checked={!buttonDisabled}
                            onChange={handleChange}
                        />
                        <StyledSpan>
                            I agree to be contacted via email
                        </StyledSpan>
                    </label>
                </StyledWrapper>
            </form>
            <StyledWrapper>
                <button className="button" onClick={handleClearForm}>
                    Clear
                </button>
                <button
                    className="button"
                    disabled={buttonDisabled}
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </StyledWrapper>
        </div>
    );
};

export default Form;
