import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    const fighterImage = createFighterImage(fighter);
    const { name, health, attack, defense } = fighter;
    const fighterInfo = document.createTextNode(
        `Name: ${name} \n Attack: ${attack} \n  Health: ${health} \n Defense: ${defense}`
    );
     const onClick = event => selectFighter(event, fighter._id);
    fighterElement.append(fighterInfo, fighterImage);
    fighterElement.addEventListener('click', onClick, false);

    return fighterElement;
}

export function createFighterImage(fighter) {
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

    return imgElement;
}
