using System;
using System.Diagnostics;
using System.IO;
using System.Text;

internal static class PaperclipDeSetup
{
    // Der Build ersetzt diesen Platzhalter durch install-de.ps1 als Base64-Text.
    private const string InstallScriptBase64 = "__SCRIPT_BASE64__";

    public static int Main(string[] args)
    {
        string scriptPath = Path.Combine(Path.GetTempPath(), "paperclip-de-install-" + Guid.NewGuid().ToString("N") + ".ps1");
        try
        {
            File.WriteAllText(
                scriptPath,
                Encoding.UTF8.GetString(Convert.FromBase64String(InstallScriptBase64)),
                new UTF8Encoding(false));

            string powershell = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.Windows),
                "System32\\WindowsPowerShell\\v1.0\\powershell.exe");
            string arguments = "-NoLogo -NoProfile -ExecutionPolicy Bypass -File " + Quote(scriptPath);
            foreach (string argument in args)
            {
                arguments += " " + Quote(argument);
            }

            using (Process process = Process.Start(new ProcessStartInfo
            {
                FileName = powershell,
                Arguments = arguments,
                UseShellExecute = false,
                CreateNoWindow = false,
                WorkingDirectory = Environment.CurrentDirectory
            }))
            {
                process.WaitForExit();
                return process.ExitCode;
            }
        }
        catch (Exception error)
        {
            Console.Error.WriteLine("Die Paperclip-Installation konnte nicht gestartet werden.");
            Console.Error.WriteLine(error.Message);
            return 1;
        }
        finally
        {
            try { if (File.Exists(scriptPath)) File.Delete(scriptPath); } catch { }
        }
    }

    private static string Quote(string value)
    {
        // Die Installationsparameter enthalten normale Windows-Pfade. Nur
        // Anführungszeichen müssen escaped werden; Backslashes bleiben intakt.
        return "\"" + value.Replace("\"", "\\\"") + "\"";
    }
}
