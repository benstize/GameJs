import controls from '../../constants/controls';
import _ from 'lodash';

const CRITICAL_HIT_COOLDOWN = 10000;

export async function fight(firstFighterHealth, secondFighterHealth, firstFighter, secondFighter) {
    return new Promise(resolve => {
        const healthBarfirstFighter = document.getElementById('left-fighter-indicator');
        const healthBarsecondFighter = document.getElementById('right-fighter-indicator');
        console.log('Health bars:', healthBarfirstFighter, healthBarsecondFighter);

        const allDownKeys = new Set();
        let isCriticalFirstReady = true;
        let isCriticalSecondReady = true;

        const handleCriticalAttack = (event, attacker, defender, isReady, setReady, healthBar, resolve) => {
            allDownKeys.add(event.code);
            const criticalHitCombination =
                attacker === firstFighter
                    ? controls.PlayerOneCriticalHitCombination
                    : controls.PlayerTwoCriticalHitCombination;
            if (!criticalHitCombination.every(code => allDownKeys.has(code))) return;

            if (isReady) {
                setReady(false);
                setTimeout(() => setReady(true), CRITICAL_HIT_COOLDOWN);

                let damage = attacker.attack * 2;
                applyDamage(damage, defender, healthBar, resolve);
                allDownKeys.clear();
            }
        };

        const handleRegularAttack = (event, attacker, defender, blockKey, attackKey, healthBar, resolve) => {
            if (event.code === blockKey) {
                console.log(`${defender.name} is blocking`);
                defender.block = true;
                return;
            }
            if (event.code === attackKey && !defender.block && attacker.health > 0) {
                let damage = getDamage(attacker, defender);
                console.log(`${attacker.name} attacks ${defender.name} for ${damage} damage`);
                applyDamage(damage, defender, healthBar, resolve);
            }
        };

        const applyDamage = (damage, fighter, healthBar, resolve) => {
            if (damage <= 0) damage = 0;
            if (fighter.health - damage > 0) {
                fighter.health -= damage;
                healthBar.style.width = `${
                    (fighter.health * 100) / (fighter === firstFighter ? firstFighterHealth : secondFighterHealth)
                }%`;
            } else {
                fighter.health = 0;
                healthBar.style.width = '0%';
                cleanupEventListeners();
                resolve(fighter === firstFighter ? secondFighter : firstFighter);
            }
        };

        const handleKeyUp = event => {
            console.log('Key up:', event.code);
            if (event.code === controls.PlayerTwoBlock) {
                secondFighter.block = false;
                console.log(`${secondFighter.name} stops blocking`);
            }
            if (event.code === controls.PlayerOneBlock) {
                firstFighter.block = false;
                console.log(`${firstFighter.name} stops blocking`);
            }
            allDownKeys.delete(event.code);
        };

        const handleKeyDown = event => {
            console.log('Key down:', event.code);
            allDownKeys.add(event.code);

            handleRegularAttack(
                event,
                firstFighter,
                secondFighter,
                controls.PlayerTwoBlock,
                controls.PlayerOneAttack,
                healthBarsecondFighter,
                resolve
            );
            handleRegularAttack(
                event,
                secondFighter,
                firstFighter,
                controls.PlayerOneBlock,
                controls.PlayerTwoAttack,
                healthBarfirstFighter,
                resolve
            );
            handleCriticalAttack(
                event,
                firstFighter,
                secondFighter,
                isCriticalFirstReady,
                state => (isCriticalFirstReady = state),
                healthBarsecondFighter,
                resolve
            );
            handleCriticalAttack(
                event,
                secondFighter,
                firstFighter,
                isCriticalSecondReady,
                state => (isCriticalSecondReady = state),
                healthBarfirstFighter,
                resolve
            );
        };

        const cleanupEventListeners = () => {
            document.body.removeEventListener('keydown', handleKeyDown);
            document.body.removeEventListener('keyup', handleKeyUp);
        };

        document.body.addEventListener('keydown', handleKeyDown);
        document.body.addEventListener('keyup', handleKeyUp);

        // Debugging logs
        console.log('Event listeners attached');
    });
}

export function getDamage(attacker, defender) {
    return getHitPower(attacker) - getBlockPower(defender);
}

export function getHitPower(fighter) {
    return fighter.attack * _.random(1, 2);
}

export function getBlockPower(fighter) {
    return fighter.defense * _.random(1, 2);
}
