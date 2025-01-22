import { LuLoaderCircle } from "react-icons/lu";
import logoIcon from "../assets/logo.png";
import logoLightIcon from "../assets/logoLight.png";

const AppLoading = () => {
  return (
    <div className="w-full absolute h-screen flex items-center justify-center flex-col gap-4">
      <div>
        <img className="mx-auto w-20 rounded-lg mb-4 dark:hidden" src={logoLightIcon} alt="Logo" />
        <img className="mx-auto w-20 rounded-lg mb-4 hidden dark:block" src={logoIcon} alt="Logo" />
      </div>
      <LuLoaderCircle className="text-4xl animate-spin" />
    </div>
  )
}

export default AppLoading