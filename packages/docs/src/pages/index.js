import React from 'react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/youtube'
import Layout from '@theme/Layout';
import toast, { Toaster } from 'react-hot-toast';

//CSS
import "tailwindcss/tailwind.css"
import 'animate.css';

//HELPER COMPONENTS
import { Delayed } from '../helper-components/delayed';
import { CtaButton } from '../helper-components/cta-button';
import { MovingCode } from '../helper-components/moving-code'
import { Feature, MainFeature } from '../helper-components/feature';

//SVG IMPORTS
import IconApiDocs from '../assets/icon-api-docs.svg'
import IconDatabase from '../assets/icon-database.svg'
import IconSecurity from '../assets/icon-security.svg'
import IconWorld from '../assets/icon-world.svg'
import IconTick from '../assets/icon-tick.svg'
import IconGithub from '../assets/icon-github.svg'
import IconYoutube from '../assets/icon-youtube.svg'
import IconDiscord from '../assets/icon-discord.svg'

const axios = require('axios').default;
const YT_URL = 'https://youtu.be/kQRRckdEFr8'
const LPBKND_BASEURL = 'https://ez-landing-page-backend.herokuapp.com'

export default function Home() {

  const [isVisible, setIsVisible] = useState(false)
  const [isAnimationOver, setIsAnimationOver] = useState(false)
  const [signUpEmail, setSignUpEmail] = useState('')

  const handleSubmit = (e) => {

    e.preventDefault();

    if (signUpEmail) {

      return axios.post(LPBKND_BASEURL + '/signUps/', {
        email: signUpEmail,
      })
        .catch(function (error) {
          console.log(error);
        })
        .then(function (response) {
          setSignUpEmail('')
        })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationOver(true)
      setIsVisible(true)
    }, 17000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <Toaster
        toastOptions={{
          style: {
            padding: '16px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#282A36',
            fontSize: 16
          },
        }}
      />
      <div id="tailwind">
        <div className='grid place-items-center'>
          <div className='

            grid
            grid-flow-row

            w-9/12
            grid-cols-1
            my-8
            gap-16

            md:w-8/12
            md:grid-cols-2
            md:m-32
            md:my-14
            md:gap-20

            '>

            <div className='col-span-full'>
              <div className='grid grid-flow-row gap-7'>
                <div className='text-5xl font-bold font-mono sm:text-center'>
                  Build Your MVP Faster
                </div>
                <div className='text-xl font-mono sm:text-center'>
                  Simple to Setup. Fully Customizable
                </div>
                <div className='flex flex-col sm:flex-row justify-center gap-4'>
                  <div>
                    <CtaButton islink={true} link="/docs/getting-started" >
                      Get Started
                    </CtaButton>
                  </div>
                  <a href='https://codesandbox.io/s/ezb-demo-1-de5d3?file=/src/index.ts' islink={false} target='_blank'>
                    <CtaButton islink={false}>
                      Live Demo
                    </CtaButton>
                  </a>
                </div>
              </div>
            </div>

            <div className='grid place-items-center lg:place-items-end self-center col-span-full lg:col-span-1'>
              <div className='bg-dracula rounded-lg w-full lg:h-320px' style={{ maxWidth: '500px' }}>
                <div className='rounded-lg text-sm pointer-events-none font-mono' style={{ padding: 32 }}>

                  <Delayed waitBeforeShow={0}>
                    <MovingCode text={codeText1} />
                  </Delayed>
                  <Delayed waitBeforeShow={3000}>
                    <MovingCode text={codeText2} />
                  </Delayed>
                  <Delayed waitBeforeShow={10000}>
                    <MovingCode text={codeText3} />
                  </Delayed>
                  <Delayed waitBeforeShow={14000}>
                    <MovingCode text={codeText4} />
                  </Delayed>

                </div>
              </div>
            </div>

            <div className='col-span-full lg:col-span-1 w-full lg:mt-6'>

              {isAnimationOver ?

                <div className='w-full' onMouseEnter={() => setIsVisible(false)} onMouseLeave={() => { setIsVisible(true) }}>

                  <div className='fade'>
                    <MainFeature
                      title={
                        <div className=''>
                          <div className='text-4xl mb-2'>Simplified</div>
                          <div className=''>Backend Development</div>
                        </div>
                      }
                    >
                      A Node framework focused on <Txty>speed</Txty> and <Txty>ease of use,</Txty> while keeping the ability to <Txty>extend</Txty> and <Txty>customize</Txty>
                    </MainFeature>
                  </div>

                </div>

                :

                <div className='self-center lg:self-start'>
                  <StepFeature delay={1700}>
                    Backend Created
                  </StepFeature>
                  <StepFeature delay={4000}>
                    Database Connection Made
                  </StepFeature>
                  <StepFeature delay={4500}>
                    <span className='text-purple'>Pets</span> Table Created in Database
                  </StepFeature>
                  <StepFeature delay={9000}>
                    <span className='text-purple'>Name</span>, <span className='text-purple'>Species</span>, <span className='text-purple'>Age</span>, Columns Added in Table
                  </StepFeature>
                  <StepFeature delay={12900}>
                    CRUD Endpoints Generated
                  </StepFeature>
                  <StepFeature delay={15000}>
                    API Documentation Generated
                  </StepFeature>
                  <StepFeature delay={15300}>
                    Running on PORT 8000
                  </StepFeature>
                </div>
              }

            </div>

            <div className='overflow-x-auto col-span-full '>
              <div className='gap-6 grid grid-flow-col'>

                <Feature
                  icon={<IconWorld className='w-12 h-12' />}
                  title='Instant CRUD Generation'
                  info='Instant CRUD endpoints generation with full customization capabilities'
                />

                <Feature
                  icon={<IconApiDocs className='w-12 h-12' />}
                  title='Automated Documentation'
                  info='Automatically generate documentation for your APIs from the models you plan'
                />
                <Feature
                  icon={<IconSecurity className='w-12 h-12' />}
                  title='One-Line Authentication'
                  info='Add user sign ups, logins and permission layering with Google'
                />

                <Feature
                  icon={<IconDatabase className='w-12 h-12' />}
                  title='Choose your Database'
                  info='Pick from multiple industry standards: Postgres, MySQL, MongoDB, & more'
                />

              </div>
            </div>

            <div className='col-span-full'>
              <div className='text-2xl lg:text-2xl font-mono mb-12 font-bold text-center'>
                Tutorial Demo
              </div>
              <div className='grid place-items-center lg:hidden'>
                <ReactPlayer
                  width='100%'
                  height='240px'
                  url={YT_URL}
                />
              </div>
              <div className='place-items-center hidden lg:grid'>
                <ReactPlayer
                  url={YT_URL}
                  controls={true}
                />
              </div>
            </div>

            <div className='col-span-full grid place-items-center'>
              <div className='font-monts font-bold text-2xl mb-12'>
                Our Community
              </div>
              <div className='flex flex-wrap mx-4 sm:mx-0 justify-center gap-8'>
                <a href='https://discord.gg/RwgdruFJHc' target='_blank'>
                  <IconDiscord className='animate-wiggle' />
                </a>
                <a href='https://github.com/kapydev/ezbackend' target='_blank'>
                  <IconGithub className='transition duration-250 ease-in-out transform hover:-translate-y-1 hover:scale-110' />
                </a>
                <a href='https://www.youtube.com/channel/UCXFyio7c5EWBGLknUJZjIzQ' target='_blank'>
                  <IconYoutube className='transition duration-250 ease-in-out transform hover:-translate-y-1 hover:scale-110' />
                </a>
              </div>
            </div>

            <div className='col-span-full flex justify-center align-middle'>
              <div className='bg-dracula p-10 rounded-lg grid gap-6'>
                <div className='font-monts text-xl text-center font-semibold'>
                  Join Our Mailing List
                </div>
                <form>
                  <input
                    onChange={e => setSignUpEmail(e.target.value)}
                    className='border-0 font-monts rounded-lg text-lg p-2 font-semibold'
                    type="text"
                    id="submitSignUps"
                    value={signUpEmail}
                    placeholder='Email'
                    name="email" />
                </form>
                <CtaButton islink={false} onClick={(e) => {
                  toast.promise(
                    handleSubmit(e),
                    {
                      loading: 'Submitting...',
                      success: <b>Submitted</b>,
                      error: <b>Server Error! We are working on it!</b>,
                    }
                  );
                }}>
                  <div className='text-sm'>
                    Sign Up
                  </div>
                </CtaButton>
              </div>
            </div>


          </div>

        </div>
      </div>

      <br />
      <br />
      <br />
      <br />

    </Layout >
  );
}

// UTILITIES

const codeText1 = "const app = new EzBackend()"
const codeText2 = `const pets = new EzModel('Pets', {
  name: Type.VARCHAR,
  species: Type.VARCHAR,
  age: Type.INT
})`
const codeText3 = `app.addApp("pets", pets, { prefix: "pets" })`
const codeText4 = `app.start()`

function Txty(props) {
  return (
    <span className='font-semibold' style={{ color: '#BD93F9' }}>{props.children}</span>
  )
}

function StepFeature(props) {
  return (
    <Delayed waitBeforeShow={props.delay}>
      <div className='fade'>
        <div className='flex justify-start gap-3 my-2'>
          <IconTick className='self-start w-6 h-6' />
          <div className='font-monts'>
            {props.children}
          </div>
        </div>
      </div>
    </Delayed>
  )
}


