import React from "react";

const About = ({ user }) => {
    if (!user) {
      return <p>Loading user data...</p>;
    }


  return (
    <section className="h-screen bg-gradient-to-r from-pink-300 to-blue-300">
      <div className="container py-5 h-screen">
        <div className="flex justify-center items-center h-screen">
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-t text-white flex flex-row" style={{ backgroundColor: "#000", height: "200px" }}>
              <div className="ms-4 mt-5 flex flex-col" style={{ width: "150px" }}>
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                  alt="Generic placeholder image"
                  className="img-fluid img-thumbnail mt-4 mb-2 w-48"
                  style={{ zIndex: "1" }}
                />
                <button type="button" className="btn btn-outline-dark" data-mdb-ripple-color="dark" style={{ zIndex: "1" }}>
                  Edit profile
                </button>
              </div>
              <div className="ms-3" style={{ marginTop: "130px" }}>
                <h5>Andy Horwitz</h5>
                <p>New York</p>
              </div>
            </div>
            <div className="p-4 text-black" style={{ backgroundColor: "#f8f9fa" }}></div>
            <div className="card-body p-4 text-black">
              <div className="mb-5">
                <p className="text-lg font-normal mb-1">About</p>
                <div className="p-4 bg-gray-100">
                  <p className="italic mb-1">Web Developer</p>
                  <p className="italic mb-1">Lives in New York</p>
                  <p className="italic mb-0">Photographer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

