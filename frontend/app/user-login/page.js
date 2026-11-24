// Attendee login route; uses the same account form with login fields.
import AccountForm from '../attendee/AccountForm';

export default function UserLogin() {
  return <AccountForm signup={false} />;
}
