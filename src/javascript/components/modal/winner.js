import createElement from '../../helpers/domHelper';
import showModal from './modal';

function createFighterWinner(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
   const imgElement = createElement({
       tagName: 'img',
       className: 'fighter-preview___img',
       attributes
   });
    const fighterElement = createElement({
        tagName: 'div',
        className: `modal-body`
    });

    fighterElement.append(imgElement);
    return fighterElement;
}

export function showWinnerModal(fighter) {
    const title = fighter.name + ' is WINNER!!!';
    const bodyElement = createFighterWinner(fighter);

    showModal({ title, bodyElement });
}
