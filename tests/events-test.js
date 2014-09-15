define(function(require, exports, module){
    'use strict'

    var Events, expect, sinon;

    Events = require('events');
    expect = require('expect');
    sinon = require('sinon');

    function equals(){
        var args = arguments;
        expect(args[0]).to.equal(args[1]);
    };

    describe('Events', function(){
        it('on and trigger', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.on('event', spy);
            obj.trigger('event');
            equals(spy.callCount, 1);

            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');
            equals(spy.callCount, 5);

            obj.trigger('event event event');
            equals(spy.callCount, 8);
        });

        it('once', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.once('event', spy);
            obj.trigger('event');

            equals(spy.callCount, 1);
            obj.trigger('event');
            equals(spy.callCount, 1);
        });

        it('binding nad triggering multiple events', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.on('a b c', spy);
            obj.trigger('a');
            equals(spy.callCount, 1);

            obj.trigger('a b');
            equals(spy.callCount, 3);

            obj.trigger('c');
            equals(spy.callCount, 4);

            obj.off('a c');
            obj.trigger('a b c');
            equals(spy.callCount, 5);
        });

        it('on, then unbind all functions', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.on('event', spy);
            obj.trigger('event');
            equals(spy.callCount, 1);

            obj.off('event');
            obj.trigger('event');
            equals(spy.callCount, 1);
        });

        it('bind two callbacks, unbind only one', function(){
            var obj = new Events();
            var spyA = sinon.spy();
            var spyB = sinon.spy();

            obj.on('event', spyA);
            obj.on('event', spyB);
            obj.trigger('event');
            equals(spyA.callCount, 1);
            equals(spyB.callCount, 1);

            obj.off('event', spyA);
            obj.trigger('event');
            equals(spyA.callCount, 1);
            equals(spyB.callCount, 2);
        });

        it('unbind a callbakc in the midst of it firing', function(){
            var obj = new Events();
            var spy = sinon.spy();

            function callback(){
                spy();
                obj.off('event', callback);
            };

            obj.on('event', callback);
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');
            equals(spy.callCount, 1);
        });

        it('two binds that unbind themselves', function(){
            var obj = new Events();
            var spyA = sinon.spy();
            var spyB = sinon.spy();

            function incrA(){
                spyA();
                obj.off('event', incrA);
            };

            function incrB(){
                spyB();
                obj.off('event', incrB);
            };

            obj.on('event', incrA);
            obj.on('event', incrB);
            obj.trigger('event');
            obj.trigger('event');
            obj.trigger('event');

            equals(spyA.callCount, 1);
            equals(spyB.callCount, 1);
        });

        it('bind a callback with a supplied context', function(){
            var obj = new Events();
            var context = {};
            var spy = sinon.spy();

            obj.on('event', spy, context);
            obj.trigger('event');
            expect(spy.calledOn(context));
        });

        it('nested trigger with unbind', function(){
            var obj = new Events();
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();

            function incr1(){
                spy1();
                obj.off('event', incr1);
                obj.trigger('event');
            };

            obj.on('event', incr1);
            obj.on('event', spy2);
            obj.trigger('event');
            equals(spy1.callCount, 1);
            equals(spy2.callCount, 2);
        });

        it('callback list is not altered during trigger', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.on('event', function(){
                obj.on('event', spy);
            }).trigger('event');

            equals(spy.callCount, 0);

            obj.off().on('event', function(){
                obj.on('event', spy);
            }).on('event', spy).trigger('event');

            equals(spy.callCount, 1);
        });

        it('`o.trigger("x y")` is equal to `o.trigger("x").trigger("y")`', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.on('x', function(){
                obj.on('y', spy);
            });
            obj.trigger('x y');
            equals(spy.callCount, 1);

            spy.reset();

            obj.off();
            obj.on('x', function(){
                obj.on('y', spy);
            });
            obj.trigger('y x');
            equals(spy.callCount, 0);
        });

        it('if no callback is provided, `on` is a noop', function(){
            expect(function(){
                new Events().on('test').trigger('test');
            }).not.to.throwException();
        });

        it('off is chainable', function(){
            var obj = new Events();

            equals(obj.off(), obj);

            obj.on('event', function(){}, obj);
            equals(obj.off(), obj);

            obj.on('event', function(){}, obj);
            equals(obj.off('event'), obj);
        });

        it('trigger returns callback status', function(){
            var obj = new Events();
            var stub1 = sinon.stub();
            var stub2 = sinon.stub();
            var stub3 = sinon.stub();

            obj.on('a', stub1);
            obj.on('a', stub2);

            stub1.returns(false);
            stub2.returns(true);
            expect(obj.trigger('a')).to.be(false);

            stub1.returns(true);
            stub2.returns(true);
            expect(obj.trigger('a')).to.be(true);

            stub1.returns(true);
            stub2.returns(false);
            expect(obj.trigger('a')).to.be(false);
        });

        it('callback context', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.on('a', spy);
            obj.trigger('a');
            expect(spy.calledOn(obj)).to.be.ok();
        });

        it('trigger arguments', function(){
            var obj = new Events();
            var spy = sinon.spy();

            obj.on('a', spy);
            obj.trigger('a', 1, 2);
            expect(spy.calledWith(1, 2)).to.be.ok();
        });
    });
});