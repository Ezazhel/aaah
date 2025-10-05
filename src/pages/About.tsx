export default function About() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The Board Game Authors Association is a non-profit organization dedicated to supporting 
            and promoting board game creators worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              We believe that board games are a powerful medium for bringing people together, 
              fostering creativity, and creating lasting memories. Our mission is to empower 
              game creators at every stage of their journey.
            </p>
            <p className="text-gray-600">
              Whether you're a first-time designer with a brilliant idea or an experienced 
              publisher looking to expand your reach, we provide the resources, community, 
              and support you need to succeed.
            </p>
          </div>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Mission Image Placeholder</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              Founded in 2020 by a group of passionate board game designers and industry veterans, 
              the Board Game Authors Association emerged from a simple observation: the board game 
              industry was thriving, but creators often felt isolated and lacked access to the 
              resources they needed to succeed.
            </p>
            <p>
              What started as informal meetups in local game stores has grown into a global 
              community of over 2,000 members across 30 countries. We've helped launch over 
              500 successful board games and facilitated countless collaborations between 
              designers, artists, and publishers.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary-600">Innovation</h3>
              <p className="text-gray-600">
                We encourage creative thinking and support experimental game mechanics and themes.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary-600">Community</h3>
              <p className="text-gray-600">
                We believe in the power of collaboration and mutual support among creators.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-primary-600">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest quality in games, resources, and community support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
