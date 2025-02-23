import { parseAbiItem } from 'viem';

export const depositAbi = parseAbiItem('event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)')
export const windrowAbi = parseAbiItem('event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)');
