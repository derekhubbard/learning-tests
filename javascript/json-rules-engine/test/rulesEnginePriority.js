const chai = require('chai');
const jsonRulesEngine = require('json-rules-engine');

const expect = chai.expect;
const Engine = jsonRulesEngine.Engine;

describe('json-rules-engine priority', async () => {
    it('returns events sorted in priority order', async () => {
        // Arrange
        const highPriorityRule = {
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
                type: 'highPriorityEvent'
            },
            priority: 100
        };

        const lowPriorityRule = {
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
                type: 'lowPriorityEvent'
            },
            priority: 10
        }
        const rules = [lowPriorityRule, highPriorityRule];
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
