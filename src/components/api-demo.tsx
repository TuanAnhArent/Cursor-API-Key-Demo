"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, ExternalLink, Play, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ApiResponse {
  valid: boolean
  key?: {
    id: string
    name: string
    usage: number
    created_at: string
  }
  error?: string
}

export function ApiDemo() {
  const [apiKey, setApiKey] = useState("tvly-prod-c1rm8mxs55l")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse>({
    valid: true,
    key: {
      id: "c22aac41-7547-4269-94aa-05d520980585",
      name: "dgvxcv",
      usage: 465,
      created_at: "2025-04-23T19:35:55.8501+00:00",
    },
  })
  const [copied, setCopied] = useState(false)

  const handleSendRequest = async () => {
    setLoading(true)

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (apiKey && apiKey.length > 10) {
      setResponse({
        valid: true,
        key: {
          id: "c22aac41-7547-4269-94aa-05d520980585",
          name: apiKey.substring(0, 6),
          usage: Math.floor(Math.random() * 1000),
          created_at: new Date().toISOString(),
        },
      })
    } else {
      setResponse({
        valid: false,
        error: "Invalid API key format",
      })
    }

    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatJson = (obj: ApiResponse): string => {
    return JSON.stringify(obj, null, 2)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 bg-white dark:bg-slate-900">
      <CardHeader className="border-b bg-slate-50 dark:bg-transparent">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">API Request Demo</CardTitle>
            <CardDescription>Test our API key validation service</CardDescription>
          </div>
          <Link href="/docs">
            <Button variant="outline" className="gap-2 hover:bg-gray-100/10 border-2 transition-all duration-200">
              <ExternalLink className="h-4 w-4" />
              Documentation
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b bg-slate-100 dark:bg-slate-800/50 flex items-center gap-2">
          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100 px-3 py-1 rounded font-mono text-sm">
            GET
          </div>
          <div className="flex-1 font-mono text-sm bg-white dark:bg-slate-950 p-2 rounded border">
            http://localhost:3000/api/validate-key
          </div>
          <Button 
            onClick={handleSendRequest} 
            disabled={loading} 
            className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Send
          </Button>
        </div>

        <div className="p-4 border-b">
          <h3 className="font-semibold mb-2">Headers</h3>
          <div className="flex gap-2 items-center">
            <div className="w-1/4 font-mono text-sm">x-api-key</div>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
              placeholder="Enter your API key"
            />
          </div>
        </div>

        <Tabs defaultValue="response" className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-10">
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="code">Code Example</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="response" className="p-0">
            <div className="p-4 flex justify-between items-center border-b bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded text-xs">
                  200 OK
                </div>
                <span className="text-sm text-muted-foreground">~200ms</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1"
                onClick={() => copyToClipboard(formatJson(response))}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-b-lg overflow-auto max-h-80 text-sm">
              <code>{formatJson(response)}</code>
            </pre>
          </TabsContent>
          <TabsContent value="code" className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">JavaScript / TypeScript</h3>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto text-sm">
                <code>{`// Using fetch API
const response = await fetch('https://api.tuananh-cursor.com/api/validate-key', {
  method: 'GET',
  headers: {
    'x-api-key': '${apiKey}'
  }
});

const data = await response.json();
console.log(data);`}</code>
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">cURL</h3>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-auto text-sm">
                <code>{`curl -X GET \\
  'https://api.tuananh-cursor.com/api/validate-key' \\
  -H 'x-api-key: ${apiKey}'`}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-transparent border-t flex justify-between">
        <div className="text-sm text-muted-foreground">Try changing the API key and sending the request again</div>
        <Button 
          onClick={handleSendRequest} 
          disabled={loading} 
          variant="outline" 
          className="gap-2 hover:bg-gray-100/10 border-2 transition-all duration-200"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Resend
        </Button>
      </CardFooter>
    </Card>
  )
}
