export default function PasswordRequirements({ password }: { password: string }) {
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const isLongEnough = password.length > 10;
  return (
    <ul className="mt-2 text-xs grid grid-cols-2 gap-x-4 gap-y-1">
      <li className={isLongEnough ? "text-green-600" : "text-gray-500"}>
        {isLongEnough ? "✔" : "✗"} More than 10 characters
      </li>
      <li className={hasLetter ? "text-green-600" : "text-gray-500"}>
        {hasLetter ? "✔" : "✗"} Contains a letter
      </li>
      <li className={hasNumber ? "text-green-600" : "text-gray-500"}>
        {hasNumber ? "✔" : "✗"} Contains a number
      </li>
      <li className={hasSymbol ? "text-green-600" : "text-gray-500"}>
        {hasSymbol ? "✔" : "✗"} Contains a symbol
      </li>
    </ul>
  );
} 