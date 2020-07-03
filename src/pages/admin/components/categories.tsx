import React, { useState } from "react";
import { TCategory } from "../../../components/products";
import SectionTitle from "../../home/components/sectiontitle";
import Snackbar, {SnackbarTime, SnackbarStyles} from "../../../components/Snackbar";
import Tooltip from "../../home/components/Tooltip";

import RemoveIcon from "../../../assets/icons/remove_circle-24px.svg";
import AddIcon from "../../../assets/icons/baseline-add.svg";
import DoneIcon from "../../../assets/icons/done-24px.svg";
import CloseIcon from "../../../assets/icons/close.svg";

export interface CategoriesProps {
    categories : TCategory[]
}
export default ({categories} : CategoriesProps) => {
    const [newCategory, setNewCategory] = useState<TCategory>({id: 0, name: ""});
    const [categoriesState, setCategoriesState] = useState<TCategory[]>(categories);
    const [snackbarActive, setSnackbarActive] = useState<boolean>(false);
    const [snackbarErrorActive, setSnackbarErrorActive] = useState<boolean>(false);
    const [hasAnyChangesFlag, setHasAnyChangesFlag] = useState<boolean>(false);

    const renderCategories = () :JSX.Element[] => {
        const rendered :JSX.Element[] = [];
        categoriesState.forEach((cat, index) => {
            rendered.push(<li key={index}>
                <input type="text" defaultValue={cat.name} onChange={handleChangeCategoryName(index)} />
                <div onClick={removeCategory(cat.id)}>
                    <Tooltip title="Eliminar" style={{marginTop: 30}}><RemoveIcon /></Tooltip>
                </div>
            </li>);
        });
        return rendered;
    };
    const removeCategory = (id :number) => () => {
        if (confirm("Estas seguro de borrar la categoria?")) {
            fetch("/admin/categorias/" + id, {
                method: "DELETE"
            }).then(res => {
                if (res.ok) {
                    categoriesState.splice(categoriesState.findIndex(c => c.id === id),1);
                    setCategoriesState([...categoriesState]);
                    activeSuccessSnackbar();
                } else {
                    activeErrorSnackbar();
                }
            });
        }
    };

    const submitCategories = (ev :any) => {
        fetch("/admin/categorias", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriesState)
        }).then(res => {
            if (res.ok) {
                location.reload();
            } else {
                activeErrorSnackbar();
            }
        });
    };

    const addCategory = (ev :any) => {
        ev.preventDefault();
        const newCategoryName :string = (document.getElementById("admin-categories-add-name") as any).value;
        if (newCategoryName !== "") {
            (document.getElementById("admin-categories-add-name") as any).value = "";
            categoriesState.push({id: 0, name: newCategoryName});
            setCategoriesState([...categoriesState]);
            setHasAnyChangesFlag(true);
        }
    };

    const handleNewCategoryInput = (ev :any) => {
        newCategory.name = ev.target.value;
        setNewCategory({...newCategory});
    };

    const handleChangeCategoryName = (index :number) => (ev :any) => {
        categoriesState[index].name = ev.target.value;
        setCategoriesState([...categoriesState]);
        setHasAnyChangesFlag(true);
    };

    const activeSuccessSnackbar = (callback? :Function) => {
        setSnackbarActive(true);
        setTimeout(() => {
            setSnackbarActive(false);
            if(typeof callback === 'function')
                callback();
        }, SnackbarTime);
    };

    const activeErrorSnackbar = () => {
        setSnackbarErrorActive(true);
        setTimeout(() => setSnackbarErrorActive(false), SnackbarTime);
    };

    const cancelChanges = () => {
        location.reload();
    };

    return (
        <div className="admin-categories-container">
            <form className="admin-categories-add" action="/admin/categorias" onSubmit={addCategory}>
                <input type="text" id="admin-categories-add-name" placeholder="Ingrese nombre" onChange={handleNewCategoryInput}/>
                <button type="submit" className="btn-light-blue"><AddIcon />AGREGAR</button>
            </form>
            <SectionTitle title="CATEGORIAS" />
            <ul className="admin-categories-content">
                {renderCategories()}
            </ul>
            <Snackbar type={SnackbarStyles.SUCCESS} message="Se han guardado los cambios" isActive={snackbarActive} />
            <Snackbar type={SnackbarStyles.ERROR} message="Hubo un error, por favor recarga la pagina." isActive={snackbarErrorActive} />
            {hasAnyChangesFlag && <div className="admin-categories-savecancel">
                <button className="btn-light-blue btn-icon-rotate360" onClick={submitCategories}><DoneIcon />GUARDAR CAMBIOS</button>
                <button className="btn-light-red" onClick={cancelChanges}><CloseIcon />CANCELAR</button>
            </div>}
        </div>
    );
}