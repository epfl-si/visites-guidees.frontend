import parsePhoneNumber from 'libphonenumber-js';

export default function PhoneNumber({ phone }: { phone: string }) {
  const parsePhone = parsePhoneNumber(phone, 'CH');
  return (
    <p>{parsePhone?.formatInternational() ?? phone}</p>
  )
}
