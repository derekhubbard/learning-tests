const chai = require('chai');
const jsonRulesEngine = require('json-rules-engine');

const expect = chai.expect;
const Engine = jsonRulesEngine.Engine;

describe('json-rules-engine priority', async () => {
    const ruleTemplate = {
        conditions: {
            any: [
                {
                    fact: 'myProperty',
                    operator: 'equal',
                    value: 'expectedValue'
                }
            ]
        },
        event: {
            type: 'eventType'
        }
    };

    it('returns events sorted in priority order', async () => {
        // Arrange
        const rule1 = {...ruleTemplate, ...{ priority: 100, event: { type: 'highPriorityEvent' } }};
        const rule2 = {...ruleTemplate, ...{ priority: 10, event: { type: 'lowPriorityEvent' } }};
        const rules = [rule2, rule1];
        const rulesEngine = new Engine(rules);
        const fact = {
            myProperty: 'expectedValue'
        }

        // Act
        const result = await rulesEngine.run(fact);

        // Assert
        expect(result).to.be.an('array');
        expect(result).to.have.lengthOf(2)
        const [firstEvent, secondEvent] = result;
        expect(firstEvent.type).to.be.eql('highPriorityEvent');
        expect(secondEvent.type).to.be.eql('lowPriorityEvent');
    })
});
