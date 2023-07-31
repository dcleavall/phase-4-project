import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
// import { loadFull } from 'tsparticles'
import { useCallback, useMemo } from 'react'; // Add missing 'from' keyword and 'react' import.

const ParticlesComponent = (props) => {
    const options = useMemo(() => ({
        // background: {
        //     color: "#000000"
        // },
        fullScreen:{
            enable: true,
            zIndex: 1,
        },
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: 'push',
                },
                onHover: {
                    enable: true,
                    mode: 'repulse',
                },
            },
            modes: {
                push: {
                    quantity: 10,
                },
                repulse: {
                    distance: 100,
                },
            },
        },
        particles: {
            links: {
                enable: true,
                    distance: 200,
            },
            move: {
                enable: true,
                speed: { min: 1, max: 3 },
            },
            opacity: {
                value: {min: 0.3, max: 0.7},
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
    }), []); // Remove the unnecessary return keyword.

    const particlesInt = useCallback((engine) => {
        loadSlim(engine);
        // loadFull(engine);

    }, []);

    return (
        <div>
            <Particles id={props.id} particlesInt={particlesInt} options={options} />
        </div>
    );
};

export default ParticlesComponent;
