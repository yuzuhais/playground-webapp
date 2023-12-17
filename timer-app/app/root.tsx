import { ChakraProvider, Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Flex, Grid, GridItem, Stack, VStack } from "@chakra-ui/react";
import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup } from '@chakra-ui/react'
import CircularProgressBar from './circularProgressBar'
import { useMediaQuery } from 'react-responsive'


export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
});

function Document({
  children,
  title = "App title",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

type timerProps = {
  isDesktopOrLaptop: boolean,
}

function Timer(props: timerProps) {
  const isDesktopOrLaptop = props.isDesktopOrLaptop;
  if (isDesktopOrLaptop) {
    return <CircularProgressBar selectedValue={25}
      maxValue={50}
      strokeWidth={100}
      activeStrokeColor='#0f4fff'
      labelFontSize={164}
      valueFontSize={72}
      withGradient
      radius={260}/>;
    }

  return <CircularProgressBar selectedValue={25}
    maxValue={50}
    strokeWidth={60}
    activeStrokeColor='#0f4fff'
    labelFontSize={164}
    valueFontSize={48}
    withGradient
    radius={160}/>;
}

export default function App() {
  // throw new Error("💣💥 Booooom");
  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  return (
    <Document>
      <ChakraProvider>
        <Box>
        <VStack>
          <Flex minHeight="22vh" minWidth="100vh" justifyContent='center' alignItems='center'>
            <Heading fill="White" stroke="White" fontWeight='extrabold' fontSize={['2xl', '2xl', '5xl']}>
            ⏱ CHAKURA-UI Timer ⏱
            </Heading>
          </Flex>
          <Box>
            <Flex direction={['column', 'column', 'column','row']} minHeight="50vh" align='center' gap='24'>
              <Box order={[2, 2, 2, 1]}>
              <ButtonGroup gap='2'>
                <Button height={['50px', '100px']} width={['100px', '200px']} fontSize={['24px', '48px']} ring="4px" ringColor="blue.200" ringOffset="3px" ringOffsetColor="blue.300">Start</Button>
                <Button height={['50px', '100px']}  width={['100px', '200px']} fontSize={['24px', '48px']}>Stop</Button>
              </ButtonGroup>
              </Box>
              <Box order={[1, 1, 1, 2]}>
                <Timer isDesktopOrLaptop={isDesktopOrLaptop}/>
              </Box>
            </Flex>
          </Box>
        </VStack>
      </Box>
      </ChakraProvider>
    </Document>
  );
}

// How ChakraProvider should be used on CatchBoundary
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ChakraProvider>
        <Box>
          <Heading as="h1" bg="purple.600">
            [CatchBoundary]: {caught.status} {caught.statusText}
          </Heading>
        </Box>
      </ChakraProvider>
    </Document>
  );
}

// How ChakraProvider should be used on ErrorBoundary
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <ChakraProvider>
        <Box>
          <Heading as="h1" bg="blue.500">
            [ErrorBoundary]: There was an error: {error.message}
          </Heading>
        </Box>
      </ChakraProvider>
    </Document>
  );
}
