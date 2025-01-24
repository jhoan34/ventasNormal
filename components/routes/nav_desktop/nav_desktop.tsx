import { routes } from "../routes.data"

export const NavDesktop = () => {
    return (
        <header className="w-full bg-black h-[20vh] shadow-lg">
            <nav className="w-full h-full flex justify-center gap-x-12 items-center bg-[#0b071e] backdrop-blur-lg p-4">
                <img className="w-16 h-16 md:w-24 md:h-24" src="/logo.svg" alt="Logo" />
                <ul className="w-[50%] h-full flex justify-around items-center">
                    {routes.map((route) => (
                        <li
                            key={route.id}
                            className="hover:text-pink-400 transition-colors duration-300 text-base sm:text-lg md:text-xl font-semibold text-white border-b-2 border-transparent hover:border-pink-400"
                        >
                            <a href={route.path}>{route.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};
