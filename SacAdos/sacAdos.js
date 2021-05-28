window.onload = function () {

    let maxw;
    let nbobjets;
    let objetsPret = false;
    let tabObjects = [];
    let cpt = 0;




    let svg = d3.select('#svg');
    document.getElementById("maxw").disabled = true; 
    document.getElementById("nbobj").disabled = true; 
    document.getElementById("gain").disabled = true; 
    document.getElementById("poids").disabled=true; 
    d3.select("#senario").on('click', function () {

        document.getElementById("maxw").disabled = false; 
        document.getElementById("nbobj").disabled =false; 
        document.getElementById("gain").disabled = false; 
        document.getElementById("poids").disabled = false; 
        d3.select("#textChaine").style("visibility", "visible");
        d3.select("#illustration").remove();
        d3.select("#svg").attr("viewBox", "220 200 900 650");
        d3.select("#affichage").style("visibility", "visible");
        d3.select("#chaineText").style('visibility', 'visible');
        map = svg.append("image").attr("x", 80).attr("y", -70).attr("height", 1200).attr("width", 1128).attr("href", 'img/world-map.png').attr("id", "map");
        scale= svg.append("image").attr("x", 470).attr("y", 534).attr("height", 280).attr("width", 300).attr("href", 'img/weighing-machine.png').attr("id", "scale");
        back = svg.append("image").attr("x", 460).attr("y", 240).attr("height", 320).attr("width", 320).attr("href", 'img/backpack.png').attr("id", "bag");
        fen = svg.append("rect").attr("x", -400).attr("y", -400).attr("width", 2000).attr("height", 2000).attr("fill", "#DEE6FA").style("opacity", 0.8).attr("id", "fen");
        com = svg.append("image").attr("x", 450).attr("y", 310).attr("height", 400).attr("width", 400).attr("href", 'img/commencer2.png').attr("id", "commencer");
        d3.select('#commencer').on('click', commence);
        d3.select('#ok').on('click', RecupererObjet);
        d3.select('#suivant').on('click', resultat);
    }
    )
    const commence = () =>
    {
        if(RecupererMaxw() && objetsPret)
        {
            d3.select("#map").style("opacity", 0.2);
            d3.select("#commencer").style("visibility", "hidden");
            d3.select("#fen").style("visibility", "hidden");
            d3.select("#suivant").style("visibility", "visible");

        }
        else
        {
             Swal.fire('Introduire les données pour commencer');
        }
  
    }

    const resultat = () =>
    {
        let result = sacAdos(maxw, tabObjects);
        svg.append("rect").attr("x", 900).attr("y", 600).attr("height", 60).attr("width", 200).attr("rx",20).attr("ry",20).attr("fill", "#EAB74D");
        svg.append("rect").attr("x", 910).attr("y", 610).attr("height", 40).attr("width", 180).attr("rx",14).attr("ry",14).attr("fill", "#77BF9A");
 
        svg.append("rect").attr("x", 900).attr("y", 680).attr("height", 60).attr("width", 200).attr("rx",20).attr("ry",20).attr("fill", "#EAB74D");
        svg.append("rect").attr("x", 910).attr("y", 690).attr("height", 40).attr("width", 180).attr("rx", 14).attr("ry", 14).attr("fill", "#DE5866");    
        
        svg.append("text").attr("x", 930).attr("y", 640).style("font-size",20).style("font-weight",700).style("fill", "#4A4D4C").text("p:  "+result.p); 
        svg.append("text").attr("x", 930).attr("y", 720).style("font-size",20).style("font-weight",700).style("fill", "#4A4D4C").text("w:  "+result.w); 
 
        for (let i=0; i < result.key.length; i++)
        {
            if(result.key[i]==="1")
            {
                d3.select("#C" + i).style("fill", "#77BF9A");
            }

        }
    
    }

    function RecupererMaxw(){
    maxw=parseInt(document.getElementById("maxw").value);
    if (maxw<=0)
    {
        return false;
    }
    return true;
    }

    function RecupererNbOBjets()
    {
        nbobjets = parseInt(document.getElementById("nbobj").value);
        if (nbobjets <= 0)
        {
            return false;
        }
        return true;
    }

    function RecupererObjet()
    {
        if (!objetsPret)
        {
            if (RecupererNbOBjets())
            {
                let poids = parseInt(document.getElementById("poids").value);
                let gain = parseInt(document.getElementById("gain").value);
                if (poids>0 && gain>=0)
                {
                    tabObjects.push({ w: poids, v: gain });
                    d3.select("#cpt").text(cpt + 1);
                    d3.select("#G" + cpt).style("visibility", "visible");
                    d3.select("#VG" + cpt).text(gain);
                    d3.select("#WG" + cpt).text(poids);
                    cpt++;
                    if (cpt == nbobjets)
                    {
                        objetsPret = true
                        document.getElementById("ok").disabled = true; 

                    };

                }
                else
                {
                     Swal.fire('Les gains et les poids sont des valeurs positives !');
                }
            }
            else
            {
                 Swal.fire("Introduire le nombre d'objets !");
            }
        }
    }




    const sacAdos = (maxw, tabObjects) => {
    let key = [];
    for (let i= 0; i < tabObjects.length; i++) {
        key[i]="0";
    }

    let maxResult = { p: 0, w: 0, key: key };
    let result = [{p:0,w:0,key:key}];
    for (let i = 0; i < tabObjects.length; i++)
    {
        let memo = {};
        const len = result.length;
        for (let j = 0; j < len; j++)
        {
            if(result[j].w+tabObjects[i].w<=maxw)
            {
            let key = [].concat(result[j].key);
            key[i] = "1";
            let record = { p: result[j].p + tabObjects[i].v, w: result[j].w + tabObjects[i].w, key: key };
            if (!(record.w in memo))
            {
                result.push(record);
                memo[record.w] = record;
                if (record.p > maxResult.p) 
                {
                    maxResult = record;
                }  
            }    
            else
            {
                if (memo[record.w].p < record.p)
                {
                    memo[record.w] = record;
                    result.push(record);
                    if (record.p > maxResult.p) 
                    {
                        maxResult = record;
                    }  
                }
            }
  
            }
            
        }
    }
    let objects = maxResult.key;
    let finalresult = [];
    for (let i = 0; i < objects.length; i++) {
        if (objects[i] === "1")
        {

            finalresult.push(tabObjects[i]);    
        }
        
    }
    return { p: maxResult.p, w: maxResult.w, tabObjects: finalresult, key: objects };
}



}

      