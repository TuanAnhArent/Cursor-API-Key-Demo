export interface ApiKeyValidationFormProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSubmit: () => void;
}

export interface ApiKeyValidationResultProps {
  apiKey: string;
  isValid: boolean;
} 