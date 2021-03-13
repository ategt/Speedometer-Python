"""
    Python script to interact with existing Windows Task Scheduler tasks.

    CLI usage:
        python windows_task_scheduler.py (enable|disable|run) -t "TaskName"

    import usage:
        import windows_task_scheduler as wts
        wts.enable-task(task_name="TaskName")
        wts.disable_task(task_name="TaskName")
        wts.run_task(task_name="TaskName")

    There are many more possibilities; at the command prompt type 'schtasks.exe /?' or e.g. 'schtasks.exe /Change /?' for details.
"""

import logging
import argparse
import subprocess

import re

logger = logging.getLogger(__name__)

EMPTY_INFO = "INFO: There are no scheduled tasks presently available at your access level."

def get_parser():
    # Parse Inputs
    parser = argparse.ArgumentParser(
        description="Provide task name", add_help=False)

    parser.add_argument("-t", "--task", dest="task_name", required=False, help="Task name ( in Windows Task Scheduler)")

    # Choose functionality
    subparsers = parser.add_subparsers()

    parser_enable = subparsers.add_parser(
      "enable", parents=[parser], help="Enable the task")
    parser_enable.set_defaults(func=enable_task)

    parser_disable = subparsers.add_parser(
      "disable", parents=[parser], help="Disable the task")
    parser_disable.set_defaults(func=disable_task)

    parser_run = subparsers.add_parser(
      "run", parents=[parser], help="Run the task")
    parser_run.set_defaults(func=run_task)

    parser_list = subparsers.add_parser(
      "list", parents=[parser], help="List the tasks")
    parser_list.set_defaults(func=query_task)

    return parser

def enable_task(args=None, task_name=None):
    "Enable existing Windows Task Scheduler task."
    if args is not None:
        task_name = args.task_name

    p = subprocess.Popen(['schtasks.exe', '/Change', '/TN', task_name,
                    '/ENABLE'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)     
    logger.info(f"Enabled task: {task_name}")

def disable_task(args=None, task_name=None):
    "Disable existing Windows Task Scheduler task."
    if args is not None:
        task_name = args.task_name

    p = subprocess.Popen(['schtasks.exe', '/Change', '/TN', task_name,
                    '/DISABLE'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)        
    logger.info(f"Disabled task: {task_name}")

def run_task(args=None, task_name=None):
    "Run existing Windows Task Scheduler task."
    if args is not None:
        print(args)
        task_name = args.task_name

    prc = subprocess.Popen(['schtasks.exe', '/Run', '/TN', task_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    err = prc.stderr.read()
    stdout = prc.stdout.read()

    if len(err) > 0:
        raise Exception(err.decode())

    if b'SUCCESS' not in stdout:
        raise Exception(stdout.decode())

    logger.info(f"Info: {stdout.decode()}")
    logger.info(f"Run task: {task_name}")

def end_task(args=None, task_name=None):
    "End an existing Windows Task Scheduler task."
    if args is not None:
        print(args)
        task_name = args.task_name

    prc = subprocess.Popen(['schtasks.exe', '/End', '/TN', task_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    err = prc.stderr.read()
    stdout = prc.stdout.read()

    if len(err) > 0:
        raise Exception(err.decode())

    if b'SUCCESS' not in stdout:
        raise Exception(stdout.decode())

    logger.info(f"Info: {stdout.decode()}")
    logger.info(f"End task: {task_name}")

def query_task(args=None, task_name=None):
    "Query existing Windows Task Scheduler task."
    p = subprocess.Popen(['schtasks.exe', '/Query', '/FO', 'LIST', '/TN', f'{task_name}'], 
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    stdout = p.stdout.read()
    err = p.stderr.read()

    p.terminate()

    p.stderr.close()
    p.stdout.close()

    if len(err) > 0:
        raise Exception(err.decode())

    tasks = stdout.decode().split("\r\n\r\n")

    TASK_LIST_REGEX = re.compile(r"HostName:(?:\W+)(?P<host_name>[^\r^\n]+)\r\nTaskName:(?:\W+)(?P<taskname>[^\r^\n]+)\r\nNext Run Time:(?:\W+)(?P<next_run_time>[^\r^\n]+)\r\nStatus:(?:\W+)(?P<status>[^\r^\n]+)\r\nLogon Mode:(?:\W+)(?P<logon_mode>[^\r^\n]+)")
    dxr = [TASK_LIST_REGEX.search(t).groupdict() for t in tasks if EMPTY_INFO not in t]

    p.wait(timeout=1)
    
    return dxr

def list_tasks():
    "List existing Windows Task Scheduler tasks."
    p = subprocess.Popen(['schtasks.exe', '/Query', '/FO', 'LIST'],
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    stdout = p.stdout.read()
    err = p.stderr.read()

    p.terminate()

    p.stderr.close()
    p.stdout.close()

    if len(err) > 0:
        raise Exception(err.decode())

    tasks = stdout.decode().split("\r\n\r\n")

    TASK_LIST_REGEX = re.compile(r"HostName:(?:\W+)(?P<host_name>[^\r^\n]+)\r\nTaskName:(?:\W+)(?P<taskname>[^\r^\n]+)\r\nNext Run Time:(?:\W+)(?P<next_run_time>[^\r^\n]+)\r\nStatus:(?:\W+)(?P<status>[^\r^\n]+)\r\nLogon Mode:(?:\W+)(?P<logon_mode>[^\r^\n]+)")
    dxr = [TASK_LIST_REGEX.search(t).groupdict() for t in tasks if EMPTY_INFO not in t]

    p.wait(timeout=1)
    
    return dxr

def main(args=None):
    logger. info("\n" + "=" * 72 + "\n{0} begun ...".format(__name__))

    # Handle arguments
    if args is None:
        args = get_parser().parse_args()
        args.func(args)
    else:
        # Use externally-provided arguments
        if args.disable_flag:
            disable_task(task_name=args.task_name)
        elif args.enable_flag:
            enable_task(task_name=args.task_name)
        elif args.run_flag:
            run_task(task_name=args.task_name)
        elif args.list_flag:
            list_task(task_name=args.task_name)

if __name__ == "__main__":
    main()