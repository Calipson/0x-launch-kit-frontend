/**
 * @jest-environment jsdom
 */

import BigNumber from '0x.js';
import { mount, shallow } from 'enzyme';
import React from 'react';

import * as tokenServices from '../../services/tokens';
import { tokenFactory } from '../../util/test-utils';
import { Web3State } from '../../util/types';

import { WalletBalance } from './wallet_balance';

describe('WalletBalance', () => {
    it('should display a message if the user did not accepted metamask permissions', async () => {
        // given
        const resultExpected1 = 'Click to Connect MetaMask';
        const onConnectWalletFn = jest.fn();
        // when
        const wrapper = mount(<WalletBalance web3State={Web3State.Locked} onConnectWallet={onConnectWalletFn} />);

        // then
        const result = wrapper.text();
        expect(result).toContain(resultExpected1);
    });
    it('should display a message if the user did not have metamask installed', async () => {
        // given
        const resultExpected1 = 'No wallet found';
        const resultExpected2 = 'Get Chrome Extension';
        const onConnectWalletFn = jest.fn();
        // when
        const wrapper = mount(<WalletBalance web3State={Web3State.NotInstalled} onConnectWallet={onConnectWalletFn} />);

        // then
        const result = wrapper.text();
        expect(result).toContain(resultExpected1);
        expect(result).toContain(resultExpected2);
    });
    it('should display quote and base balances', async done => {
        // given
        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();
        const currencyPair = {
            base: 'WETH',
            quote: 'ZRX',
        };
        const ethAccount = '';

        const resultExpected1 = 'WETH';
        const resultExpected2 = 'ZRX';
        const amountExpected = '2.0';
        const onConnectWalletFn = jest.fn();
        // @ts-ignore
        tokenServices.getTokenBalance = jest.fn(() => {
            // @ts-ignore
            return new BigNumber('2.0');
        });
        // when
        const wrapper = shallow(
            <WalletBalance
                web3State={Web3State.Done}
                onConnectWallet={onConnectWalletFn}
                baseToken={baseToken}
                currencyPair={currencyPair}
                ethAccount={ethAccount}
                quoteToken={quoteToken}
            />,
        );

        wrapper.update();

        setTimeout(() => {
            const quoteTokenResult = wrapper
                .childAt(1)
                .childAt(0)
                .text();
            const quoteValueResult = wrapper
                .childAt(1)
                .childAt(1)
                .text();
            const baseTokenResult = wrapper
                .childAt(2)
                .childAt(0)
                .text();
            const baseValueResult = wrapper
                .childAt(2)
                .childAt(1)
                .text();
            //  console.log("quote value result ", quoteValueResult.debug())
            expect(baseTokenResult).toContain(resultExpected1);
            expect(quoteTokenResult).toContain(resultExpected2);
            expect(quoteValueResult).toContain(amountExpected);
            expect(baseValueResult).toContain(amountExpected);
            done();
        }, 0);
        // then
    });
});
