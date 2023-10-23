import { useEffect,useState } from 'react';
import * as C from './App.styles';

import logoImage from './assets/devmemory_logo.png'
import iconRestart from './svgs/restart.svg'

import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import { GridItem } from './components/GridItem';

import { GridItemType } from './types/GridItemType';
import { items } from './data/items';

import { formatTimeElapsed } from './helpers/formTimeElapsed';


function App() {
  const [playing,setPlaying]= useState<boolean>(false);
  const [timeElapsed,setTimeElapsed]= useState<number>(0);
  const [moveCount,setMoveCount]= useState<number>(0);
  const [shownCount,setShownCount]= useState<number>(0);
  const [gridItems,setGridItems]= useState<GridItemType[]>([]);

  //Na hora que começa a carregar inicia a função que inicia o jogo
  useEffect(()=> resetAndCreateGrid(),[]);

  //useEffect para time
  useEffect(()=>{
    const timer = setInterval(()=>{
      if(playing) setTimeElapsed(timeElapsed+1);
    },1000);
    return()=> clearInterval(timer)
  },[playing,timeElapsed])

  //Verifica se os time são iguais
  useEffect(()=>{
    if(shownCount===2){
      const opened = gridItems.filter((item)=> item.shown === true);
      if(opened.length===2){
        //se são iguais deixa permanente
        if(opened[0].item===opened[1].item){
          const tmpGrid = [...gridItems]
          for(const i in tmpGrid){
            if(tmpGrid[i].shown){
              tmpGrid[i].permanentShown=true;
              tmpGrid[i].shown=false;
            }
            setGridItems(tmpGrid)
            setShownCount(0);
          }
        }else{
          //se não são iguais, setshow como false
          setTimeout(()=>{
            const tmpGrid = [...gridItems]
          for(const i in tmpGrid){
            tmpGrid[i].shown=false
          }
          setGridItems(tmpGrid)
          setShownCount(0);
          },1000)
        }
        
        setMoveCount(moveCount=>moveCount+1)
      }
    }
  },[shownCount,gridItems])

  //verifica 
  useEffect(()=>{
    if(moveCount>0&& gridItems.every(item=>item.permanentShown===true)){
      setPlaying(false);
    }
  },[moveCount,gridItems])
  
  const resetAndCreateGrid = ()=>{
    //passo 1 -resetar o jogo 
    setTimeElapsed(0)
    setMoveCount(0)
    setShownCount(0)
    
    //passo 2 - criar o grid e começar o jogo
    //2.1 criar um grid vazio
    const tmpGrid: GridItemType[]=[];
    for(let i=0; i<(items.length*2); i++) tmpGrid.push({
        item: null, shown: false, permanentShown: false
      })
    
    //2.2 - preencher o grid com as cartas
    for(let w=0;w<2;w++){
      for(let i=0;i<items.length;i++){
        let pos = -1;
        while(pos<0 || tmpGrid[pos].item!==null){
          pos = Math.floor(Math.random()*(items.length*2));
        }
        tmpGrid[pos].item=i;
      }
    }  

    //2.3 jogar no state
    setGridItems(tmpGrid);

    //passo 3 - começar o jogo 
    setPlaying(true);
  }

  const pauseButton = ()=>{
    if(playing){
      setPlaying(false);
    }else{
      setPlaying(true);
    }
  }

  const hadnleItemClick=(index:number)=>{
    if(playing && index !== null && shownCount<2){
      const tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false){
        tmpGrid[index].shown=true,
        setShownCount(shownCount+1)
      }

      setGridItems(tmpGrid);
    }
  }

  return (
 
    <C.Container>
      <C.Info>
        <C.logoLink href=''>
          <img src={logoImage} alt="" width="200" />
        </C.logoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}/>
          <InfoItem label='Movementos' value={moveCount.toString()}/>
        </C.InfoArea>

          <Button label="Reiniciar" icon={iconRestart} onClick={resetAndCreateGrid}/>
          <Button label={playing ? 'Pausa' : 'Voltar'} onClick={pauseButton}/>

      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item,index)=>(
            <GridItem 
              key={index}
              item={item}
              onClick={()=>hadnleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>

  )
}

export default App
