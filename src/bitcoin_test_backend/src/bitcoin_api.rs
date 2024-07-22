use ic_cdk::api::management_canister::bitcoin::{
    bitcoin_get_balance, bitcoin_get_current_fee_percentiles, bitcoin_get_utxos,
    bitcoin_send_transaction, BitcoinNetwork, GetBalanceRequest, GetCurrentFeePercentilesRequest,
    GetUtxosRequest, GetUtxosResponse, MillisatoshiPerByte, SendTransactionRequest,
};

pub async fn get_balance(network: BitcoinNetwork, address: String) -> u64 {
    let min_confirmations = None;
    let balance_res = bitcoin_get_balance(GetBalanceRequest {
        address,
        network,
        min_confirmations,
    })
    .await;

    balance_res.unwrap().0
}

pub async fn get_utxos(network: BitcoinNetwork, address: String) -> GetUtxosResponse {
    let filter = None;
    let utxos_res = bitcoin_get_utxos(GetUtxosRequest {
        address,
        network,
        filter,
    })
    .await;

    utxos_res.unwrap().0
}

pub async fn get_current_fee_percentiles(network: BitcoinNetwork) -> Vec<MillisatoshiPerByte> {
    let res =
        bitcoin_get_current_fee_percentiles(GetCurrentFeePercentilesRequest { network }).await;

    res.unwrap().0
}

pub async fn send_transaction(network: BitcoinNetwork, transaction: Vec<u8>) {
    let res = bitcoin_send_transaction(SendTransactionRequest {
        network,
        transaction,
    })
    .await;

    res.unwrap();
}
