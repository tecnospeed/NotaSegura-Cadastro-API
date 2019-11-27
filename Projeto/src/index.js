console.log('aqui')
const axios = require('axios')
console.log('passou')
const fs = require('fs')
const config = require('../config')
const { cpf, cnpj } = require('cpf-cnpj-validator');
const qs = require('querystring')
const swal = require('sweetalert2')
// ...


const carregaArquivo = async (evt) => 
{
    var extPermitidas = ['csv']
    var extArquivo = evt.target.value.split('.').pop()

    if(typeof extPermitidas.find((ext) => extArquivo == extPermitidas) == 'undefined'){
        console.log('extensão não '+ extArquivo +' permitida!')
    }else{     
        
        let span = document.querySelector('#span-upload')
        let textSpan = evt.target.files[0].name
        span.innerHTML = textSpan


        sessionStorage.removeItem('data')
        sessionStorage.removeItem('error')
        sessionStorage.removeItem('obj')

        const listEmp = await fs.readFileSync(evt.target.files[0].path,'utf-8').split('\n')
        

        if(listEmp){
            await validaArquivo(listEmp)
    
        }
    }
    
}

const validaArquivo = async (listClientes) => {
    const listData  =  []
    const listError =  []
    const arrFull   =  []

    listClientes.forEach((item, index) => {
        let error = []
        if(item !== null & item.length !== 0)
        {
            let listVerifica = item.split(',')

            let razaoSocial  = listVerifica[0]
            let nomeFantasia = listVerifica[1]
            let cpf_cpnj     = listVerifica[2].replace(/[\/\.\s-]+/g,'')
            let email        = listVerifica[3]
            
            validarCaracter(razaoSocial) ? error.push('Caracter inválido [Razão social]'): false
            validarCaracter(nomeFantasia) ? error.push('Caracter inválido [Nome Fantasia]'): false
            !checkMail(email) ?  error.push('E-mail inválido') : false
            listVerifica.length !== 5   ?  error.push('Quantidade de campos informados incorreto') : false

            
            if(cpf_cpnj.length > 11){
                !cnpj.isValid(listVerifica[2]) ? error.push('CNPJ inválido'): false
            }else{
                !cpf.isValid(listVerifica[2])? error.push('CPF inválido'): false
            }
            

            if(error.length !== 0){
                let arrError = [index]
                arrError.push(error)

                listError.push(arrError)
            }else{
                listData.push(listVerifica)
            }
            arrFull.push(listVerifica)            
                
        }
    })

    sessionStorage.setItem('data',  JSON.stringify(listData))
    sessionStorage.setItem('error', JSON.stringify(listError))
    sessionStorage.setItem('obj',   JSON.stringify(arrFull))
    
    if(listError.length > 0){        
        CriaTbError()
    }else{
        CriaTbDados()
    }
}

const saveClient = async () => {
    const elementToken = document.querySelector('#inputToken')
    const token = elementToken.value
    sessionStorage.removeItem('error-request')

    const emp = JSON.parse(sessionStorage.getItem('data'))

    if(!token){
        swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Token da softwarehouse não informado!',
            footer: ''
          })
          return ''
    }

    console.log(token)
    if(emp){
        
        await emp.forEach(async (empresa, index) => {
        
            if(config.envnotasegura){
                const url = `https://app.notasegura.com.br/api/users/?softwarehouse=${token}`

                
                    try {
                        const { data, status } = await axios.post(url, qs.stringify({
                            corporate_name: empresa[0],
                            name: empresa[1],
                            cnpj: empresa[2],
                            email: empresa[3],
                            password: empresa[4].trim()                      
                        }) ,{
                            headers: { 'accept' : 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
                        })
                        
                        console.log(data)
                        console.log(status)
                    } catch (error) {
                        console.log('erro: '+ error)                        
                        console.log('dados', empresa)
                                        
                        await erroEnvio(index, error.message)
                        
                    } 
                   
            
            }
        })
        swal.fire(
            'Informações enviadas!',
            '',
            'success'
          )
    }
  }

const checkMail = (mail) => {
    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);

    if(typeof(mail) == "string" && er.test(mail)){              
        return true; 
        
    }else if(typeof(mail) == "object" && er.test(mail.value)){
        return true; 	
    }else{
        return false;
    }
}

const validarCaracter = (campo) => {
    var regex = '^[a-z\u00C0-\u00ff A-Z0-9]+';
    return campo.match(regex)? false : true
}


const CriaTbDados = () => {
    var marca = false
    let dataTableAll = document.querySelector('#dataTable')
    let dataTableFilho = dataTableAll.querySelector('tbody')

    dataTableAll.removeChild(dataTableFilho)

    if(dataTableFilho.querySelector('tr')){marca = true}
    
    let dataTable = document.createElement('tbody')

    let listar = JSON.parse(sessionStorage.getItem('data'))
    let navClient = document.querySelector('#data-client') 

    listar.forEach(linha => {
        var tr = document.createElement('tr')
        linha.forEach((colums) => {
            
            var td = document.createElement('td')
            
            var textA = document.createTextNode(colums)
            td.appendChild(textA)
            tr.appendChild(td)

           
        })
        dataTable.appendChild(tr)
        
    });

    dataTableAll.appendChild(dataTable)
    if(marca){
        retrieveTable('dataTable')
        ContructorTable('dataTable')
        console.log('reetrieve')
    }else{
        ContructorTable('dataTable')        
    }


    let btn = document.querySelector('#btn-enviar')

    if(navClient && !btn){
       
        navClient.style.display = ""
        openTab(0, 'dados-clientes') 
        //Criando button estilizado
        let aButton   = document.createElement('a')

        aButton.setAttribute('onclick','saveClient()')
        aButton.setAttribute('class','float-sm-right')
        aButton.setAttribute('type','button')
        aButton.setAttribute('id','btn-enviar')

        let spanIcon = document.createElement('span')
        spanIcon.setAttribute('class','glyphicon glyphicon-floppy-disk')        
        spanIcon.setAttribute('aria-hidden','true')
        
        let label = document.createElement('label')
        label.setAttribute('class','btn btn-primary')
        label.appendChild(spanIcon)


        let textButton = document.createTextNode(' Enviar cadastro')
        label.appendChild(textButton)

        aButton.appendChild(label)


        let divEnviar = document.querySelector('#div-enviar')
        divEnviar.appendChild(aButton)

        //error remove
        let elementError = document.querySelector('#error-csv')
        if(elementError){
            elementError.style.display = "none"
            console.log('ocoulta')
        }
        

    }

}

const CriaTbError = () => {

    var marca = false
    //Remove informações da table caso existir
    let dataTableAll = document.querySelector('#dataTable-error')
    let dataTableFilho = dataTableAll.querySelector('tbody')
    let btn = document.querySelector('#btn-enviar')
    if(btn){btn.remove()}
    marca = dataTableFilho.querySelector('tr') ? true : false

    dataTableAll.removeChild(dataTableFilho)


    

    let dataTable = document.createElement('tbody')
    let elementError = document.querySelector('#error-csv')
    let ulElement = document.querySelector('.nav-tabs')
    let navClient = document.querySelector('#data-client')    
    
    if(elementError == null){
        console.log(elementError)
        
        let liElement = document.createElement('li')
        let aElement = document.createElement('a')
        let liText    = document.createTextNode('Error')

        aElement.appendChild(liText)
        aElement.setAttribute('class','nav-link active')
        aElement.setAttribute('onclick',"openTab(1, 'erros-clientes')")
        aElement.setAttribute('id','nav-error')
        aElement.setAttribute('href','#')

        liElement.setAttribute('class','nav-item active')
        liElement.setAttribute('id','error-csv')
        liElement.appendChild(aElement)
        ulElement.appendChild(liElement)
    }

    if(navClient){
        navClient.style.display = "none"
        openTab(0, 'erros-clientes') 
        

    }


    let listar = JSON.parse(sessionStorage.getItem('error'))

    listar.forEach(linha => {
        var tr   = document.createElement('tr')
        var td   = document.createElement('td')
        var textA, textFinal

        linha.forEach((item, index) => {

            if(index == 0){
                var tdIndex = document.createElement('td')
                var textIndex = document.createTextNode("Erro encontrado na linha " + parseInt(item + 1 ) )

                tdIndex.appendChild(textIndex)
                tr.appendChild(tdIndex)
            } else{
                            
                textA ? textA += ', ' + item : textA = item 
            }  

           
        })
        textFinal = document.createTextNode(textA)
        td.appendChild(textFinal)
        tr.appendChild(td)

        dataTable.appendChild(tr)

    });    

    dataTableAll.appendChild(dataTable)

    if(marca)
    {
        retrieveTable('dataTable-error')
        ContructorTable('dataTable-error')
    }else{
        ContructorTable('dataTable-error')
    }    

}

const ContructorTable = (table) => {
    

    $(document).ready( function () {

        $('#'+table ).DataTable({
            language:{
            "sEmptyTable": "Nenhum registro encontrado",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ resultados por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar",
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        }})}
    );
}

const retrieveTable = (table) => {
    table = $('#'+table).DataTable( {retrieve:true} );
    table.destroy()
}

const erroEnvio = (id, value) => {
    var marca = false
    let dataTableAll = document.querySelector('#dataTable-error')
    let dataTable = dataTableAll.querySelector('tbody')

    if(dataTable.querySelector('tr'))
    {
        marca = true
    }

    let elementError = document.querySelector('#error-csv')
    let ulElement = document.querySelector('.nav-tabs')

    console.log('entrou')
    if(elementError == null){
        
        let liElement = document.createElement('li')
        let aElement = document.createElement('a')
        let liText    = document.createTextNode('Error')

        aElement.appendChild(liText)
        aElement.setAttribute('class','nav-link')
        aElement.setAttribute('onclick',"openTab(1, 'erros-clientes')")
        aElement.setAttribute('id','nav-error')
        aElement.setAttribute('href','#')

        liElement.setAttribute('class','nav-item')
        liElement.setAttribute('id','error-csv')
        liElement.appendChild(aElement)
        ulElement.appendChild(liElement)
    }else{
        elementError.style.display = ""
    }

    var tr   = document.createElement('tr')
    var td   = document.createElement('td')
    var textIndex = document.createTextNode("Erro encontrado na linha " + parseInt(id + 1 ) )
    td.appendChild(textIndex)
    tr.appendChild(td)

    var tdValue = document.createElement('td')
    var textValue= document.createTextNode(value) 

    tdValue.appendChild(textValue)
    tr.appendChild(tdValue)

    dataTable.appendChild(tr)

    if(marca)
    {
        table = $('#dataTable-error').DataTable( {
            retrieve: true,
            paginate: true
        } );

    }else{
        ContructorTable('dataTable-error')
    }  

}