import { useAtributos } from "../../hooks/useAtributos";

function NavBar() {
  const {nombreApartado} = useAtributos();
  return (
        <nav className="navbar bg-light">
          <div className="container-fluid">
            <button className="btn btn-primary d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-expanded="false" aria-controls="sidebarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="mx-auto">
            <span className="navbar-brand">{nombreApartado}</span>
            </div>
          </div>
        </nav>
    );
}

export default NavBar;