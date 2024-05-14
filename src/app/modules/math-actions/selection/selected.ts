import { Func } from "../../math-structures/function";
import { MathStruct } from "../../math-structures/math-structure";
import { Sqrt } from "../../math-structures/sqrt";
import { Term } from "../../math-structures/term";
import { getParents, getChildren } from "../structure-actions";
import { SelectedStructures } from "./selected-structures";

export const selected: SelectedStructures = new SelectedStructures();
const allStructures: Map<MathStruct, HTMLElement> = new Map();

const disabledTargets = ['(', ')'];

export function clearSelected(){
    Array.from(selected.keys()).forEach(struct => {
        allStructures.get(struct)?.classList.remove("selected");
    });
    selected.clear();
}

function addSelected(struct: MathStruct){
    let elem = allStructures.get(struct) as HTMLElement;
    if(!elem) throw new Error("Element not found");
    selected.add(struct);
    elem.classList.add("selected");
}

function removeSelected(struct: MathStruct){
    selected.delete(struct);
    let elem = allStructures.get(struct) as HTMLElement;
    if(!elem) throw new Error("Element not found");
    elem.classList.remove("selected");
}

// Select element if all children are selected 
function checkParentSelection(struct: MathStruct | null){
    if(!struct || struct instanceof Func || struct instanceof Sqrt) return;
    if(struct.children.every(child => selected.has(child))){ 
        if(struct instanceof Term && struct.sign == '-') return; // do not select term with '- sign
        struct.children.forEach((child)=>removeSelected(child));
        addSelected(struct);
        checkParentSelection(struct.parent);
    }
}

export function removeStruct(elem: HTMLElement): void{
    elem.querySelectorAll('.struct').forEach((structEl)=>{
        Array.from(allStructures.entries()).forEach(([key, val])=>{
            if(val == structEl) {
                allStructures.delete(key);
                selected.delete(key);
            }
        });
    });
}

// get HTML (MJX element) with selected structures
export function getSelectedElement(){
    let formula = selected.structuresParent;
    if(!formula) return null;
    return allStructures.get(formula)?.parentElement?.parentElement as HTMLElement;
}

export function setListener(struct: MathStruct, elem: HTMLElement){
    let findSelected = (structures: MathStruct[]) => structures.find(struct => selected.has(struct));
    let targetCheck = (t: HTMLElement) => t.localName == "mjx-c" && !disabledTargets.includes(getComputedStyle(t, 'before').content);

    elem.classList.add("struct");
    allStructures.set(struct, elem);
    let parents = getParents(struct);
    let children = getChildren(struct);
    elem.addEventListener("click", (event) => {
        if(!targetCheck(event.target as HTMLElement)) return;
        if(selected.has(struct)){
            removeSelected(struct);
            event.stopPropagation();
        }else if(!findSelected(parents)){
            addSelected(struct);
            checkParentSelection(struct.parent);
            children.forEach((child)=>removeSelected(child));
            event.stopPropagation();
        }
    });
    elem.addEventListener('mousemove', (event) => {
        if(!targetCheck(event.target as HTMLElement) || event.buttons !== 1) return;
        if(selected.has(struct)){
            if(event.ctrlKey) removeSelected(struct);
            event.stopPropagation();
        }else if(!findSelected(parents) && !event.ctrlKey){
            addSelected(struct);
            checkParentSelection(struct.parent);
            children.forEach((child)=>removeSelected(child));
            event.stopPropagation();
        }
    });
}