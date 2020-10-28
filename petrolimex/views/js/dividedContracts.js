function rowUpdate(driverId_, name_, code_, creditLimit_, creditRemain_, max_transaction_, dividedContractId_) {
    let row = '<tr class="content">\n\t<td style="display: none"><input type="number" name="driverId" value="' + driverId_ + '"></td>\n';
    row += '<td><input class="form-control" type="text" value="' + name_ + '" readonly></td>\n';
    row += '<td><input class="form-control" type="text" name="code" value=\"' + code_ + '\" readonly></td>\n';
    row += '<td><input class="form-control" type="number" name="creditLimit" min="' + (creditLimit_ - creditRemain_) + '" value="' + creditLimit_+ '" step="1000000"></td>\n';
    row += '<td><input class="form-control" type="number" name="total_transacted" value="' + (creditLimit_ - creditRemain_) + '" readonly></td>\n';
    row += '<td><input class="form-control" type="number" name="max_transaction" value="' + max_transaction_ + '"></td>\n';
    row += '<td style="display: none;"><input class="form-control" type="text" name="dividedContractId" value="' + dividedContractId_ + '" readonly></td>\n</tr>';
    return row;
}

function rowAdd(name_, code_, residentId_, phone_, plate_, driverId_) {
    let row = '<tr class="content">\n\t<td><input class="form-control" type="text" value=\"' + name_ + '\" readonly></td>\n';
    row += '<td><input class="form-control" type="text" value=\"' + code_ + '\" readonly></td>\n';
    row += '<td><input class="form-control" type="text" value="' + residentId_ + '" readonly></td>\n';
    row += '<td><input class="form-control" type="text" value="' + phone_ + '" readonly></td>\n';
    row += '<td><input class="form-control" type="text" value="' + plate_ + '" readonly></td>\n';
    row += '<td><input class="form-control" type="checkbox" value="' + driverId_ + '"></td>\n</tr>';
    return row;
}

function rowInsert(driverId_, name_, code_, creditLimit_, max_transaction_) {
    let row = '<tr class="content"><td style="display: none"><input type="number" name="driverId" value=' + driverId_ + '></td>\n';
    row += '<td><input class="form-control" type="text" value="' + name_ + '" readonly></td>\n';
    row += '<td><input class="form-control" type="text" name="code" value="' + code_ + '" readonly></td>';
    row += '<td><input class="form-control" type="number" name="creditLimit" min="0" value="' + creditLimit_ + '" step="1000000"></td>\n';
    row += '<td><input class="form-control" type="number" name="max_transaction" min="0" value="' + max_transaction_ + '" step="100000"></td>\n';
    row += '<td style="border:none;padding-left: 8px;padding-right: 0px;width: 50px;"><button class="btn btn-success" type="button" value="' + driverId_ + '">Delete</button></td></tr>\n';
    return row;
}

function row(val1, val2, val3, val4, val5, val6, val7){
    let row = '<tr class="content">';
    row += '<td>' + val1 + '</td>';
    row += '<td>' + val2 + '</td>';
    row += '<td>' + val3 + '</td>';
    row += '<td>' + val4 + '</td>';
    row += '<td>' + val5 + '</td>';
    row += '<td>' + val6 + '</td>';
    row += '<td>\n\t<input type="radio" class="form-control" style="width: 20px;" name="dividedContractId" value="' + val7 + '"></td>';
    row += '</tr>';
    return row;
}



$(document).ready(function() {
    let data, contract, drivers;
    let user = JSON.parse(localStorage.getItem('user'));


    function load() {
        let temp = {};
        if(user.info) {
            let keyId = user.type + "Id";
            temp[keyId] = user.info[keyId];
        }
        
        axios.post('/getDividedContracts', temp).then(res => {
            let dividedContracts = res.data.dividedContracts;
            
            let rows = '';
            for(let dividedContract of dividedContracts) {
                rows += row(dividedContract.code, dividedContract.driver.name, dividedContract.contract.name, dividedContract.creditLimit, dividedContract.creditRemain, dividedContract.max_transaction, dividedContract.dividedContractId);
            }
            $('#content tr[class=content]').remove();
            $('#content').append(rows);
        })
    }
    
    load();

    $('#start').click(function() {
        axios.post('/getClients_Contracts', {clientId: user.info.clientId}).then((res) => {
            data = res.data;
            /* let str = '';
            for(let client of data.clients_contracts) {
                str += '<option value=' + client.clientId + '>' + client.name + '\n';
            }
            $('#clientId option').remove();
            $('#clientId').append(str); */
            str = '';
            for(let contract of data.clients_contracts.contracts) {
                str += '<option value=' + contract.contractId + '>' + contract.name + '\n';
            }
            $('#contractId option').remove();
            $('#contractId').append(str);
        });
    });
    
   /*  $(document).on('change', "#clientId", function() {
        let index = data.clients_contracts.findIndex(client => client.clientId.toString() === this.value);
        str = '';
        for(let contract of data.clients_contracts[index].contracts) {
            str += '<option value=' + contract.contractId + '>' + contract.name + '\n';
        }
        $('#contractId option').remove();
        $('#contractId').append(str);
        
    }) */


    $('#continue').click(function() {
        
        axios.post('/getToCreateDividedContract', {
            clientId: user.info.clientId,
            contractId: $('#contractId').val()
        }).then(res => {
            data = res.data;
            contract = data.contract;
            
            $('#contract').text(contract.name);
            $('#client').text(user.info.name);
            $('#signedDate').text(contract.signedDate);
            $('#startDate').text(contract.startDate);
            $('#expiredDate').text(contract.expiredDate);
            $('#debtCeiling').text(contract.debtCeiling);
            $('#status').text(contract.status);
            $('#creditRemain').val(contract.creditRemain);
            str = '';
            for(let divContract of contract.dividedContracts) {
                str += rowUpdate(divContract.driverId, divContract.driver.name, divContract.code, divContract.creditLimit, divContract.creditRemain, divContract.max_transaction, divContract.dividedContractId);
            }
            $('table.update  tr[class="content"]').remove();
            $('table.update').append(str);

            $('table.insert  tr[class="content"]').remove();

            drivers = data.drivers;
            
            // for(let driver of contract.dividedContracts) {
            //     let index = drivers.findIndex(driver_ => driver.driver.driverId === driver_.driverId);
            //     drivers.splice(index,1);
            // }
            
            str = '';
            for(let driver of drivers) {
                str += rowAdd(driver.name, driver.code, driver.residentId, driver.phone, driver.plate, driver.driverId);
            }
            $('table.add tr[class="content"]').remove();
            $('table.add').append(str);

        })        
    })
    
    
    $('#add').click(function() {
        let checked = $('table.add :checked');
        $('table.add :checked').parentsUntil('tbody').remove();
        let checkedDriverId = [];
        for(let i = 0; i < checked.length; i++) {
            checkedDriverId.push(checked[i.toString()].value);
            
        }

        
        for(let driverId of checkedDriverId) {
            let index = drivers.findIndex(driver_ => driverId === driver_.driverId.toString());
            if(index !== -1) {
                let code_ = drivers[index].code + "-" + contract.code;
                let str = rowInsert(drivers[index].driverId, drivers[index].name, code_, 0,'');
                $('table.insert').append(str);
                
            }
            
        }


    })

    $(document).on('click', 'table.insert button', function() {
        let index = drivers.findIndex(driver_ => this.value === driver_.driverId.toString());
        if(index !== -1) {
            let str = rowAdd(drivers[index].name, drivers[index].code, drivers[index].residentId, drivers[index].phone, drivers[index].plate, drivers[index].driverId);
            $('table.add').append(str);
        }
        $(this).parentsUntil('tbody').remove();

    })

    $('#create').click(function() {
        let dividedContracts = {update: [], insert: []};
        let rows = $('table.insert tr[class=content]');

        for(let i = 0; i < rows.length; i++) {
            let row = rows[i.toString()].getElementsByTagName("input")
            let obj = {};
            for(let element of row) {
                if(element.name) {
                    if(element.type === "number")
                        obj[element.name] = parseInt(element.value);
                    else
                        obj[element.name] = element.value ? element.value : "";
                }    
            }

            dividedContracts.insert.push(dividedContract("" , obj.driverId, obj.code, contract.contractId, obj.creditLimit, obj.creditLimit, obj.max_transaction));
        }

        rows = $('table.update tr[class=content]');

        for(let i = 0; i < rows.length; i++) {
            let row = rows[i.toString()].getElementsByTagName("input");
            let obj = {};
            for(let element of row) {
                if(element.name === "creditLimit" || element.name === "max_transaction" || element.name === "dividedContractId") {
                    if(element.type === "number")
                        obj[element.name] = parseInt(element.value);
                    else
                        obj[element.name] = element.value ? element.value : "";
                }    
            }

            dividedContracts.update.push(dividedContract(obj.dividedContractId , '', '', '', obj.creditLimit, '', obj.max_transaction));
        }
        
        axios.post('/createDividedContract', dividedContracts).then(res => {
            load();
            alert(JSON.stringify(res.data.status, null, 4));
        })
    })


    let dividedContract_ = {};
    $('#update').click(function() {
        axios.post('/getDividedContracts', {
            dividedContractId: $('#content :checked').val()
        }).then(res => {
            dividedContract_ = res.data.dividedContracts[0];
            $('#modal-update input[name=driver]').val(dividedContract_.driver.name);
            $('#modal-update input[name=code]').val(dividedContract_.code);
            $('#modal-update input[name=dividedContractId]').val(dividedContract_.dividedContractId);
            $('#modal-update input[name=contract]').val(dividedContract_.contract.name);
            $('#modal-update input[name=creditRemain]').val(dividedContract_.creditRemain);
            $('#modal-update input[name=max_transaction]').val(dividedContract_.max_transaction);
            $('#modal-update input[name=creditLimit]').val(dividedContract_.creditLimit);
            $('#modal-update input[name=creditLimit]').attr('min',dividedContract_.creditLimit - dividedContract_.creditRemain);
        })

    })

    $(document).on('focus change bulr', '#modal-update input[name=creditLimit]', function() {
        $('#modal-update input[name=creditRemain]').val(parseInt(this.value) - dividedContract_.creditLimit + dividedContract_.creditRemain);
    })

    $('#btn-update').click(function() {
        axios.post('/updateDividedContract', {
            dividedContractId: $('#modal-update input[name=dividedContractId]').val(),
            creditLimit: $('#modal-update input[name=creditLimit]').val(),
            creditRemain: $('#modal-update input[name=creditRemain]').val(),
            max_transaction: $('#modal-update input[name=max_transaction]').val(),
        }).then((res) => {
            load();
            alert(res.data.status);
        })
    })

}); 