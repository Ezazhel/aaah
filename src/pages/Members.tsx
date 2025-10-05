export default function Members() {
  const membershipTiers = [
    {
      name: 'Hobbyist',
      price: 'Free',
      features: [
        'Access to community forums',
        'Basic design resources',
        'Monthly newsletter',
        'Local meetup notifications'
      ]
    },
    {
      name: 'Designer',
      price: '$29/month',
      features: [
        'Everything in Hobbyist',
        'Premium design templates',
        'Playtesting coordination',
        'Direct mentor access',
        'Design feedback sessions'
      ]
    },
    {
      name: 'Professional',
      price: '$79/month',
      features: [
        'Everything in Designer',
        'Publishing consultation',
        'Manufacturing connections',
        'Marketing resources',
        'Industry event discounts',
        'Priority support'
      ]
    }
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Membership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the membership level that best fits your needs and join our community of board game creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {membershipTiers.map((tier, index) => (
            <div key={tier.name} className={`bg-white rounded-lg shadow-lg p-8 ${index === 1 ? 'ring-2 ring-primary-600' : ''}`}>
              {index === 1 && (
                <div className="bg-primary-600 text-white text-sm font-semibold py-1 px-3 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-primary-600 mb-6">{tier.price}</div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                index === 1 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : 'border border-primary-600 text-primary-600 hover:bg-primary-50'
              }`}>
                {tier.price === 'Free' ? 'Join Free' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Member Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold mb-2">Resource Library</h3>
              <p className="text-sm text-gray-600">Access to comprehensive design guides and templates</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-semibold mb-2">Playtesting Network</h3>
              <p className="text-sm text-gray-600">Connect with playtesters worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="font-semibold mb-2">Manufacturing Contacts</h3>
              <p className="text-sm text-gray-600">Vetted list of reliable manufacturers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">Marketing Support</h3>
              <p className="text-sm text-gray-600">Promote your games to our community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
