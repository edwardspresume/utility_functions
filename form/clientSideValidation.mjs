export default function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    return Array.from(inputs).flatMap(validateInput);
}

// Define patterns for input types that require pattern validation
const PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^(http|https):\/\/[^ "]+$/,
    phone: /^\d{3}-\d{3}-\d{4}$/,
};

// Validation rules for input fields
function validateInput(input) {
    const validationRules = [
        {
            // Check if a required input field is empty
            test: () => input.required && !input.value.trim(),
            message: () =>
                `${input.name} is a required field, please enter a value`,
        },

        {
            // Check if the input value length is within the specified range
            test: () => hasInvalidLength(input),
            message: () =>
                `${input.name} must have at least ${input.minLength} and no more than ${input.maxLength} characters`,
        },
        
        {
            // Check if the input value matches the specified pattern for a given input type
            test: () => !matchesPattern(input),
            message: () =>
                `Please enter a valid ${input.type} for the field: ${input.name}`,
        },
    ];

    return validationRules
        .filter((rule) => rule.test())
        .map((rule) => rule.message());
}

function hasInvalidLength(input) {
    const { value, minLength, maxLength } = input;

    if (!input.hasAttribute('minlength') && !input.hasAttribute('maxlength')) {
        return false;
    }

    const tooShort =
        input.hasAttribute('minlength') && value.length < minLength;

    const tooLong = input.hasAttribute('maxlength') && value.length > maxLength;

    return tooShort || tooLong;
}

function matchesPattern(input) {
    const pattern = PATTERNS[input.type];

    if (!pattern) return true;

    return pattern.test(input.value);
}
