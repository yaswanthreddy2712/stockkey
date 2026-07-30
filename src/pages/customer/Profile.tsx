import DashboardShell from '../../components/DashboardShell'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import Badge from '../../components/ui/Badge'
import { inr, formatDate } from '../../lib/utils'
import { IconCheck } from '../../components/icons'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 font-medium text-slate-800">{value || '—'}</p>
    </div>
  )
}

export default function CustomerProfile() {
  const { user } = useAuth()
  const { getCustomer } = useData()
  const customer = user?.customerId ? getCustomer(user.customerId) : undefined

  if (!customer) {
    return <DashboardShell variant="customer"><div className="card p-10 text-center text-slate-600">Account setup in progress.</div></DashboardShell>
  }

  return (
    <DashboardShell variant="customer">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Profile & KYC</h1>
        <p className="text-slate-500 text-sm">Your personal and investment details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <div className="card p-6 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-brand-700 text-2xl font-bold">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 text-lg font-bold text-slate-800">{customer.name}</h2>
          <p className="text-sm text-slate-500">{customer.email}</p>
          <div className="mt-3 flex flex-col items-center gap-1.5">
            <Badge color={customer.kycVerified ? 'green' : 'amber'}>
              {customer.kycVerified ? <><IconCheck className="h-3 w-3" /> KYC Verified</> : 'KYC Pending'}
            </Badge>
            <Badge color={customer.status === 'Active' ? 'green' : 'amber'}>{customer.status}</Badge>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Member since</p>
            <p className="font-semibold text-slate-800">{formatDate(customer.joinDate)}</p>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-4">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" value={customer.name} />
              <Field label="Email" value={customer.email} />
              <Field label="Phone" value={customer.phone} />
              <Field label="Date of Birth" value={customer.dateOfBirth || '—'} />
              <Field label="Aadhaar" value={customer.aadhaar} />
              <Field label="PAN" value={customer.pan} />
              <div className="sm:col-span-2"><Field label="Address" value={customer.address} /></div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-800 mb-4">Investment Details</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Plan" value={customer.plan} />
              <Field label="Invested Amount" value={inr(customer.investedAmount)} />
              <Field label="Monthly Payout" value={inr(customer.monthlyPayout)} />
            </div>
            <p className="mt-4 text-xs text-slate-400">
              To update your details, please contact your advisor at <a href="tel:+917013178382" className="text-brand-600">+91 70131 78382</a>.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
