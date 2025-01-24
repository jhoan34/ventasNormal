import { routes } from "../routes.data"

export const NavDesktop = () => {
    return (
        <header className="w-full bg-black h-[12vh] ">
            <nav className="w-full h-full flex justify-center items-center">
                <ul className="w-[50%] h-full flex justify-around items-center">
                    {routes.map((route) => (
                        <li key={route.id} className="p-4 rounded-lg hover:bg-[#bd5167] bg-[#EE7890]">
                            <a href={route.path}>{route.name}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}