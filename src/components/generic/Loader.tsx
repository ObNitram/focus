import { ColorRing } from 'react-loader-spinner'


export function Loader(){
    return (
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                  <ColorRing
                      visible={true}
                      height="100"
                      width="100"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      colors={['#8400ff', '#7700e6','#6a00cc','#5c00b3','#4f0099']}
                  />

        </div>
    )
}